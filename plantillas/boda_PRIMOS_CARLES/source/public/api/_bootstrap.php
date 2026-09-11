<?php
declare(strict_types=1);

const WEDDING_TEMPLATE_MESSAGES_PATH = __DIR__ . '/../_messages/messages.json';
const WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH = __DIR__ . '/../_messages/login-attempts.json';
const WEDDING_TEMPLATE_SESSION_AUTH_KEY = 'wedding_template_moderation_authenticated';
const WEDDING_TEMPLATE_SESSION_CSRF_KEY = 'wedding_template_moderation_csrf';
const WEDDING_TEMPLATE_LOGIN_WINDOW_SECONDS = 900;
const WEDDING_TEMPLATE_LOGIN_BLOCK_SECONDS = 900;
const WEDDING_TEMPLATE_LOGIN_MAX_ATTEMPTS = 8;

function wedding_template_seed_store(): array
{
    return [
        'approvedMessages' => [],
        'pendingMessages' => [],
    ];
}

function wedding_template_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443');

    ini_set('session.use_only_cookies', '1');
    ini_set('session.use_strict_mode', '1');
    session_name('wedding_template_session');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);

    session_start();
}

function wedding_template_send_security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: same-origin');
    header('Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()');
}

function wedding_template_send_no_cache_headers(): void
{
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
}

function wedding_template_send_json(array $payload, int $status = 200)
{
    http_response_code($status);
    wedding_template_send_security_headers();
    wedding_template_send_no_cache_headers();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function wedding_template_fail(string $message, int $status)
{
    wedding_template_send_json(['error' => $message], $status);
}

function wedding_template_read_json_input(): array
{
    $rawBody = file_get_contents('php://input');
    if (!is_string($rawBody) || trim($rawBody) === '') {
        return [];
    }

    $decoded = json_decode($rawBody, true);
    return is_array($decoded) ? $decoded : [];
}

function wedding_template_string_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function wedding_template_normalize_messages($value): array
{
    if (!is_array($value)) {
        return [];
    }

    $messages = [];

    foreach ($value as $item) {
        if (
            !is_array($item) ||
            !isset($item['id'], $item['name'], $item['message']) ||
            !is_string($item['id']) ||
            !is_string($item['name']) ||
            !is_string($item['message'])
        ) {
            continue;
        }

        $messages[] = [
            'id' => $item['id'],
            'name' => $item['name'],
            'message' => $item['message'],
        ];
    }

    return $messages;
}

function wedding_template_ensure_store(): void
{
    $directoryPath = dirname(WEDDING_TEMPLATE_MESSAGES_PATH);

    if (!is_dir($directoryPath)) {
        mkdir($directoryPath, 0775, true);
    }

    if (!is_file(WEDDING_TEMPLATE_MESSAGES_PATH)) {
        file_put_contents(
            WEDDING_TEMPLATE_MESSAGES_PATH,
            json_encode(wedding_template_seed_store(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            LOCK_EX
        );
    }
}

function wedding_template_ensure_login_attempt_store(): void
{
    $directoryPath = dirname(WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH);

    if (!is_dir($directoryPath)) {
        mkdir($directoryPath, 0775, true);
    }

    if (!is_file(WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH)) {
        file_put_contents(WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH, '{}', LOCK_EX);
    }
}

function wedding_template_read_store(): array
{
    wedding_template_ensure_store();

    $rawStore = file_get_contents(WEDDING_TEMPLATE_MESSAGES_PATH);
    $decodedStore = is_string($rawStore) ? json_decode($rawStore, true) : null;

    if (!is_array($decodedStore)) {
        $decodedStore = wedding_template_seed_store();
    }

    return [
        'approvedMessages' => wedding_template_normalize_messages($decodedStore['approvedMessages'] ?? []),
        'pendingMessages' => wedding_template_normalize_messages($decodedStore['pendingMessages'] ?? []),
    ];
}

function wedding_template_write_store(array $store): void
{
    wedding_template_ensure_store();

    $normalizedStore = [
        'approvedMessages' => wedding_template_normalize_messages($store['approvedMessages'] ?? []),
        'pendingMessages' => wedding_template_normalize_messages($store['pendingMessages'] ?? []),
    ];

    $encodedStore = json_encode(
        $normalizedStore,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    if (!is_string($encodedStore)) {
        throw new RuntimeException('No se pudo codificar el almacén de mensajes.');
    }

    $handle = fopen(WEDDING_TEMPLATE_MESSAGES_PATH, 'c+');
    if ($handle === false) {
        throw new RuntimeException('No se pudo abrir el almacén de mensajes.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('No se pudo bloquear el almacén de mensajes.');
        }

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, $encodedStore);
        fflush($handle);
        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }
}

function wedding_template_read_login_attempt_store(): array
{
    wedding_template_ensure_login_attempt_store();

    $rawStore = file_get_contents(WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH);
    $decodedStore = is_string($rawStore) ? json_decode($rawStore, true) : null;

    return is_array($decodedStore) ? $decodedStore : [];
}

function wedding_template_write_login_attempt_store(array $store): void
{
    wedding_template_ensure_login_attempt_store();

    $encodedStore = json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($encodedStore)) {
        throw new RuntimeException('No se pudo codificar el almacén de intentos.');
    }

    $handle = fopen(WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH, 'c+');
    if ($handle === false) {
        throw new RuntimeException('No se pudo abrir el almacén de intentos.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('No se pudo bloquear el almacén de intentos.');
        }

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, $encodedStore);
        fflush($handle);
        flock($handle, LOCK_UN);
    } finally {
        fclose($handle);
    }
}

function wedding_template_read_environment_value(string $key): ?string
{
    $sources = [getenv($key)];

    if (isset($_SERVER[$key])) {
        $sources[] = $_SERVER[$key];
    }

    if (isset($_ENV[$key])) {
        $sources[] = $_ENV[$key];
    }

    if (function_exists('apache_getenv')) {
        $sources[] = apache_getenv($key);
    }

    foreach ($sources as $value) {
        if (!is_string($value)) {
            continue;
        }

        $trimmedValue = trim($value);
        if ($trimmedValue !== '') {
            return $trimmedValue;
        }
    }

    return null;
}

function wedding_template_decode_base64_secret(string $value): ?string
{
    $normalizedValue = trim($value);
    if ($normalizedValue === '') {
        return null;
    }

    if (strncmp($normalizedValue, 'base64:', 7) === 0) {
        $normalizedValue = substr($normalizedValue, 7);
    } elseif (
        strpos($normalizedValue, '=') === false
        && strpos($normalizedValue, '+') === false
        && strpos($normalizedValue, '/') === false
        && strpos($normalizedValue, '-') === false
        && strpos($normalizedValue, '_') === false
    ) {
        return null;
    }

    if ($normalizedValue === '') {
        return null;
    }

    $base64Value = strtr($normalizedValue, '-_', '+/');
    $paddingLength = strlen($base64Value) % 4;
    if ($paddingLength > 0) {
        $base64Value .= str_repeat('=', 4 - $paddingLength);
    }

    if (!preg_match('/^[A-Za-z0-9+\/]*={0,2}$/', $base64Value)) {
        return null;
    }

    $decodedValue = base64_decode($base64Value, true);
    if (!is_string($decodedValue) || $decodedValue === '') {
        return null;
    }

    $canonicalEncodedValue = rtrim(strtr(base64_encode($decodedValue), '+/', '-_'), '=');
    $comparableInputValue = rtrim(strtr($normalizedValue, '+/', '-_'), '=');

    if ($canonicalEncodedValue !== $comparableInputValue) {
        return null;
    }

    return $decodedValue;
}

function wedding_template_collect_secret_variants(string $value): array
{
    $normalizedValue = trim($value);
    if ($normalizedValue === '') {
        return [];
    }

    $variants = [$normalizedValue];
    $decodedValue = wedding_template_decode_base64_secret($normalizedValue);

    if ($decodedValue !== null && !in_array($decodedValue, $variants, true)) {
        $variants[] = $decodedValue;
    }

    return $variants;
}

function wedding_template_read_override_password(): ?string
{
    $keys = ['WEDDING_TEMPLATE_MODERATION_PASSWORD', 'MODERATION_PASSWORD'];

    foreach ($keys as $key) {
        $environmentValue = wedding_template_read_environment_value($key);
        if ($environmentValue !== null) {
            return $environmentValue;
        }
    }

    return null;
}

function wedding_template_verify_password(string $candidate): bool
{
    $candidateVariants = wedding_template_collect_secret_variants($candidate);
    if ($candidateVariants === []) {
        return false;
    }

    $overridePassword = wedding_template_read_override_password();

    if ($overridePassword === null) {
        return false;
    }

    $overrideVariants = wedding_template_collect_secret_variants($overridePassword);

    foreach ($overrideVariants as $overrideVariant) {
        foreach ($candidateVariants as $candidateVariant) {
            if (hash_equals($overrideVariant, $candidateVariant)) {
                return true;
            }
        }
    }

    return false;
}

function wedding_template_get_request_ip(): string
{
    $remoteAddress = isset($_SERVER['REMOTE_ADDR']) && is_string($_SERVER['REMOTE_ADDR'])
        ? trim($_SERVER['REMOTE_ADDR'])
        : '';

    return $remoteAddress !== '' ? $remoteAddress : 'unknown';
}

function wedding_template_get_login_rate_limit_state(): array
{
    $store = wedding_template_read_login_attempt_store();
    $requestIp = wedding_template_get_request_ip();
    $now = time();
    $entry = isset($store[$requestIp]) && is_array($store[$requestIp]) ? $store[$requestIp] : [];
    $attempts = isset($entry['attempts']) && is_array($entry['attempts']) ? $entry['attempts'] : [];

    $recentAttempts = array_values(array_filter(
        $attempts,
        static fn($value): bool => is_int($value) && $value >= $now - WEDDING_TEMPLATE_LOGIN_WINDOW_SECONDS
    ));

    $blockedUntil = isset($entry['blockedUntil']) && is_int($entry['blockedUntil']) ? $entry['blockedUntil'] : 0;
    $remainingSeconds = max(0, $blockedUntil - $now);

    return [
        'requestIp' => $requestIp,
        'recentAttempts' => $recentAttempts,
        'blockedUntil' => $blockedUntil,
        'remainingSeconds' => $remainingSeconds,
        'store' => $store,
    ];
}

function wedding_template_format_rate_limit_message(int $remainingSeconds): string
{
    $remainingMinutes = max(1, (int) ceil($remainingSeconds / 60));
    return sprintf('Demasiados intentos. Espera %d minuto%s y vuelve a probar.', $remainingMinutes, $remainingMinutes === 1 ? '' : 's');
}

function wedding_template_require_login_attempt_available(): void
{
    $state = wedding_template_get_login_rate_limit_state();

    if ($state['remainingSeconds'] > 0) {
        wedding_template_fail(wedding_template_format_rate_limit_message($state['remainingSeconds']), 429);
    }
}

function wedding_template_record_failed_login(): void
{
    $state = wedding_template_get_login_rate_limit_state();
    $now = time();
    $recentAttempts = $state['recentAttempts'];
    $recentAttempts[] = $now;

    $state['store'][$state['requestIp']] = [
        'attempts' => $recentAttempts,
        'blockedUntil' => count($recentAttempts) >= WEDDING_TEMPLATE_LOGIN_MAX_ATTEMPTS
            ? $now + WEDDING_TEMPLATE_LOGIN_BLOCK_SECONDS
            : 0,
    ];

    foreach ($state['store'] as $ip => $entry) {
        if (!is_array($entry)) {
            unset($state['store'][$ip]);
            continue;
        }

        $entryAttempts = isset($entry['attempts']) && is_array($entry['attempts']) ? $entry['attempts'] : [];
        $entryRecentAttempts = array_values(array_filter(
            $entryAttempts,
            static fn($value): bool => is_int($value) && $value >= $now - WEDDING_TEMPLATE_LOGIN_WINDOW_SECONDS
        ));
        $entryBlockedUntil = isset($entry['blockedUntil']) && is_int($entry['blockedUntil']) ? $entry['blockedUntil'] : 0;

        if ($entryRecentAttempts === [] && $entryBlockedUntil <= $now) {
            unset($state['store'][$ip]);
        }
    }

    wedding_template_write_login_attempt_store($state['store']);
}

function wedding_template_clear_failed_logins(): void
{
    $state = wedding_template_get_login_rate_limit_state();

    if (!array_key_exists($state['requestIp'], $state['store'])) {
        return;
    }

    unset($state['store'][$state['requestIp']]);
    wedding_template_write_login_attempt_store($state['store']);
}

function wedding_template_is_authenticated(): bool
{
    wedding_template_start_session();
    return ($_SESSION[WEDDING_TEMPLATE_SESSION_AUTH_KEY] ?? false) === true;
}

function wedding_template_get_csrf_token(): string
{
    wedding_template_start_session();

    if (
        !isset($_SESSION[WEDDING_TEMPLATE_SESSION_CSRF_KEY]) ||
        !is_string($_SESSION[WEDDING_TEMPLATE_SESSION_CSRF_KEY]) ||
        $_SESSION[WEDDING_TEMPLATE_SESSION_CSRF_KEY] === ''
    ) {
        $_SESSION[WEDDING_TEMPLATE_SESSION_CSRF_KEY] = bin2hex(random_bytes(32));
    }

    return $_SESSION[WEDDING_TEMPLATE_SESSION_CSRF_KEY];
}

function wedding_template_mark_authenticated(): void
{
    wedding_template_start_session();
    session_regenerate_id(true);
    $_SESSION[WEDDING_TEMPLATE_SESSION_AUTH_KEY] = true;
    $_SESSION[WEDDING_TEMPLATE_SESSION_CSRF_KEY] = bin2hex(random_bytes(32));
}

function wedding_template_logout(): void
{
    wedding_template_start_session();
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();

        setcookie(session_name(), '', [
            'expires' => time() - 42000,
            'path' => $params['path'] ?: '/',
            'domain' => $params['domain'] ?: '',
            'secure' => (bool) $params['secure'],
            'httponly' => (bool) $params['httponly'],
            'samesite' => $params['samesite'] ?: 'Lax',
        ]);
    }

    session_destroy();
}

function wedding_template_require_authentication(): void
{
    if (!wedding_template_is_authenticated()) {
        wedding_template_send_json([
            'authenticated' => false,
            'csrfToken' => null,
            'pendingMessages' => [],
            'approvedMessages' => [],
        ], 401);
    }
}

function wedding_template_require_csrf(array $input): void
{
    $headerToken = isset($_SERVER['HTTP_X_CSRF_TOKEN']) && is_string($_SERVER['HTTP_X_CSRF_TOKEN'])
        ? $_SERVER['HTTP_X_CSRF_TOKEN']
        : '';
    $bodyToken = isset($input['csrfToken']) && is_string($input['csrfToken']) ? $input['csrfToken'] : '';
    $candidateToken = $headerToken !== '' ? $headerToken : $bodyToken;

    if ($candidateToken === '' || !hash_equals(wedding_template_get_csrf_token(), $candidateToken)) {
        wedding_template_fail('Solicitud inválida.', 403);
    }
}
