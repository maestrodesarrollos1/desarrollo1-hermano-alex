<?php
declare(strict_types=1);

// Dynamic data stays outside the published web directory. This keeps it safe
// when a new dist/ is uploaded over SFTP.
const WEDDING_TEMPLATE_PRIVATE_DATA_DIR = __DIR__ . '/../../_private';
const WEDDING_TEMPLATE_MESSAGES_PATH = WEDDING_TEMPLATE_PRIVATE_DATA_DIR . '/messages.json';
const WEDDING_TEMPLATE_GAME_PATH = WEDDING_TEMPLATE_PRIVATE_DATA_DIR . '/game-scores.json';
const WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH = WEDDING_TEMPLATE_PRIVATE_DATA_DIR . '/login-attempts.json';
const WEDDING_TEMPLATE_PUBLIC_RATE_LIMIT_PATH = WEDDING_TEMPLATE_PRIVATE_DATA_DIR . '/public-rate-limits.json';
const WEDDING_TEMPLATE_LEGACY_MESSAGES_PATH = __DIR__ . '/../_messages/messages.json';
const WEDDING_TEMPLATE_LEGACY_GAME_PATH = __DIR__ . '/../_messages/game-scores.json';
const WEDDING_TEMPLATE_LEGACY_LOGIN_ATTEMPTS_PATH = __DIR__ . '/../_messages/login-attempts.json';
const WEDDING_TEMPLATE_SESSION_AUTH_KEY = 'wedding_template_moderation_authenticated';
const WEDDING_TEMPLATE_SESSION_CSRF_KEY = 'wedding_template_moderation_csrf';
const WEDDING_TEMPLATE_SESSION_LAST_ACTIVITY_KEY = 'wedding_template_moderation_last_activity';
const WEDDING_TEMPLATE_LOGIN_WINDOW_SECONDS = 900;
const WEDDING_TEMPLATE_LOGIN_BLOCK_SECONDS = 900;
const WEDDING_TEMPLATE_LOGIN_MAX_ATTEMPTS = 8;
const WEDDING_TEMPLATE_SESSION_IDLE_TIMEOUT_SECONDS = 1800;
const WEDDING_TEMPLATE_MAX_JSON_REQUEST_BYTES = 32768;
const WEDDING_TEMPLATE_PRIVACY_NOTICE_VERSION = '2026-11-05';
const WEDDING_TEMPLATE_GAME_DEFAULT_CUTOFF_AT = '2027-03-13T23:59:59+01:00';

function wedding_template_seed_store(): array
{
    return [
        'approvedMessages' => [],
        'pendingMessages' => [],
    ];
}

function wedding_template_seed_game_store(): array
{
    return [
        'scores' => [],
    ];
}

function wedding_template_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isSecure = wedding_template_is_secure_request();

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

function wedding_template_is_secure_request(): bool
{
    $forwardedProto = isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && is_string($_SERVER['HTTP_X_FORWARDED_PROTO'])
        ? strtolower(trim(explode(',', $_SERVER['HTTP_X_FORWARDED_PROTO'])[0]))
        : '';

    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443')
        || $forwardedProto === 'https';
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
    $contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
    if ($contentLength > WEDDING_TEMPLATE_MAX_JSON_REQUEST_BYTES) {
        wedding_template_fail('La solicitud es demasiado grande.', 413);
    }

    $rawBody = file_get_contents('php://input');
    if (is_string($rawBody) && strlen($rawBody) > WEDDING_TEMPLATE_MAX_JSON_REQUEST_BYTES) {
        wedding_template_fail('La solicitud es demasiado grande.', 413);
    }
    if (!is_string($rawBody) || trim($rawBody) === '') {
        return [];
    }

    $decoded = json_decode($rawBody, true);
    return is_array($decoded) ? $decoded : [];
}

function wedding_template_require_json_post_request(): void
{
    $contentType = isset($_SERVER['CONTENT_TYPE']) && is_string($_SERVER['CONTENT_TYPE'])
        ? strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'])[0]))
        : '';

    if ($contentType !== 'application/json') {
        wedding_template_fail('El formato de la solicitud no es válido.', 415);
    }

    $fetchSite = isset($_SERVER['HTTP_SEC_FETCH_SITE']) && is_string($_SERVER['HTTP_SEC_FETCH_SITE'])
        ? strtolower($_SERVER['HTTP_SEC_FETCH_SITE'])
        : '';
    if ($fetchSite === 'cross-site') {
        wedding_template_fail('Origen de solicitud no permitido.', 403);
    }

    $origin = isset($_SERVER['HTTP_ORIGIN']) && is_string($_SERVER['HTTP_ORIGIN'])
        ? rtrim(strtolower($_SERVER['HTTP_ORIGIN']), '/')
        : '';
    if ($origin === '') {
        return;
    }

    $host = isset($_SERVER['HTTP_HOST']) && is_string($_SERVER['HTTP_HOST'])
        ? strtolower($_SERVER['HTTP_HOST'])
        : '';
    $expectedOrigin = (wedding_template_is_secure_request() ? 'https' : 'http') . '://' . $host;
    if ($host === '' || !hash_equals($expectedOrigin, $origin)) {
        wedding_template_fail('Origen de solicitud no permitido.', 403);
    }
}

function wedding_template_ensure_private_data_directory(): void
{
    if (!is_dir(WEDDING_TEMPLATE_PRIVATE_DATA_DIR) && !mkdir(WEDDING_TEMPLATE_PRIVATE_DATA_DIR, 0700, true) && !is_dir(WEDDING_TEMPLATE_PRIVATE_DATA_DIR)) {
        throw new RuntimeException('No se pudo crear el directorio privado.');
    }

    @chmod(WEDDING_TEMPLATE_PRIVATE_DATA_DIR, 0700);
}

function wedding_template_restrict_private_file(string $path): void
{
    @chmod($path, 0600);
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
    wedding_template_ensure_private_data_directory();

    if (!is_file(WEDDING_TEMPLATE_MESSAGES_PATH) && is_file(WEDDING_TEMPLATE_LEGACY_MESSAGES_PATH)) {
        if (!copy(WEDDING_TEMPLATE_LEGACY_MESSAGES_PATH, WEDDING_TEMPLATE_MESSAGES_PATH)) {
            throw new RuntimeException('No se pudo migrar el almacén de mensajes al directorio privado.');
        }
    }

    if (!is_file(WEDDING_TEMPLATE_MESSAGES_PATH)) {
        file_put_contents(
            WEDDING_TEMPLATE_MESSAGES_PATH,
            json_encode(wedding_template_seed_store(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            LOCK_EX
        );
    }

    wedding_template_restrict_private_file(WEDDING_TEMPLATE_MESSAGES_PATH);
}

function wedding_template_ensure_login_attempt_store(): void
{
    wedding_template_ensure_private_data_directory();

    if (!is_file(WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH) && is_file(WEDDING_TEMPLATE_LEGACY_LOGIN_ATTEMPTS_PATH)) {
        if (!copy(WEDDING_TEMPLATE_LEGACY_LOGIN_ATTEMPTS_PATH, WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH)) {
            throw new RuntimeException('No se pudo migrar el registro de acceso al directorio privado.');
        }
    }

    if (!is_file(WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH)) {
        file_put_contents(WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH, '{}', LOCK_EX);
    }

    wedding_template_restrict_private_file(WEDDING_TEMPLATE_LOGIN_ATTEMPTS_PATH);
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

function wedding_template_normalize_game_scores($value): array
{
    if (!is_array($value)) {
        return [];
    }

    $scores = [];

    foreach ($value as $item) {
        if (
            !is_array($item) ||
            !isset($item['id'], $item['name'], $item['score'], $item['createdAt']) ||
            !is_string($item['id']) ||
            !is_string($item['name']) ||
            !is_int($item['score']) ||
            !is_string($item['createdAt']) ||
            (!isset($item['phone']) && !isset($item['email']) && !isset($item['legacyEmail']))
        ) {
            continue;
        }

        $phone = isset($item['phone']) && is_string($item['phone'])
            ? wedding_template_normalize_game_phone($item['phone'])
            : null;
        $legacyEmailSource = isset($item['email']) && is_string($item['email'])
            ? $item['email']
            : (isset($item['legacyEmail']) && is_string($item['legacyEmail']) ? $item['legacyEmail'] : '');
        $legacyEmail = $legacyEmailSource !== ''
            ? strtolower($legacyEmailSource)
            : '';

        if ($phone === null && $legacyEmail === '') {
            continue;
        }

        $scores[] = [
            'id' => $item['id'],
            'name' => $item['name'],
            'phone' => $phone ?? '',
            'legacyEmail' => $legacyEmail,
            'score' => $item['score'],
            'privacyConsent' => ($item['privacyConsent'] ?? false) === true,
            'privacyNoticeVersion' => isset($item['privacyNoticeVersion']) && is_string($item['privacyNoticeVersion'])
                ? $item['privacyNoticeVersion']
                : '',
            'createdAt' => $item['createdAt'],
        ];
    }

    return $scores;
}

function wedding_template_normalize_game_phone(string $value): ?string
{
    $value = trim($value);
    $normalized = preg_replace('/[\s().-]/u', '', $value);

    if (!is_string($normalized) || preg_match('/^\+?\d{7,15}$/', $normalized) !== 1) {
        return null;
    }

    return $normalized;
}

function wedding_template_ensure_game_store(): void
{
    wedding_template_ensure_private_data_directory();

    if (!is_file(WEDDING_TEMPLATE_GAME_PATH) && is_file(WEDDING_TEMPLATE_LEGACY_GAME_PATH)) {
        if (!copy(WEDDING_TEMPLATE_LEGACY_GAME_PATH, WEDDING_TEMPLATE_GAME_PATH)) {
            throw new RuntimeException('No se pudo migrar el ranking al directorio privado.');
        }
    }

    if (!is_file(WEDDING_TEMPLATE_GAME_PATH)) {
        file_put_contents(
            WEDDING_TEMPLATE_GAME_PATH,
            json_encode(wedding_template_seed_game_store(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            LOCK_EX
        );
    }

    wedding_template_restrict_private_file(WEDDING_TEMPLATE_GAME_PATH);
}

function wedding_template_read_game_store(): array
{
    wedding_template_ensure_game_store();

    $rawStore = file_get_contents(WEDDING_TEMPLATE_GAME_PATH);
    $decodedStore = is_string($rawStore) ? json_decode($rawStore, true) : null;

    if (!is_array($decodedStore)) {
        $decodedStore = wedding_template_seed_game_store();
    }

    return [
        'scores' => wedding_template_normalize_game_scores($decodedStore['scores'] ?? []),
    ];
}

function wedding_template_write_game_store(array $store): void
{
    wedding_template_ensure_game_store();

    $normalizedStore = [
        'scores' => wedding_template_normalize_game_scores($store['scores'] ?? []),
    ];

    $encodedStore = json_encode(
        $normalizedStore,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    if (!is_string($encodedStore)) {
        throw new RuntimeException('No se pudo codificar el ranking.');
    }

    $handle = fopen(WEDDING_TEMPLATE_GAME_PATH, 'c+');
    if ($handle === false) {
        throw new RuntimeException('No se pudo abrir el ranking.');
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('No se pudo bloquear el ranking.');
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

function wedding_template_game_cutoff_at(): ?string
{
    return wedding_template_read_environment_value('WEDDING_GAME_CUTOFF_AT')
        ?? WEDDING_TEMPLATE_GAME_DEFAULT_CUTOFF_AT;
}

function wedding_template_build_private_game_ranking(array $scores, ?int $limit = 10): array
{
    $grouped = [];

    foreach (wedding_template_normalize_game_scores($scores) as $score) {
        $identifier = $score['phone'] !== '' ? 'phone:' . $score['phone'] : 'legacy:' . $score['legacyEmail'];
        $current = $grouped[$identifier] ?? null;

        if ($current === null) {
            $grouped[$identifier] = [
                'name' => $score['name'],
                'phone' => $score['phone'],
                'legacyEmail' => $score['legacyEmail'],
                'score' => $score['score'],
                'attempts' => 1,
                'lastPlayedAt' => $score['createdAt'],
            ];
            continue;
        }

        $current['attempts']++;
        $current['lastPlayedAt'] = $score['createdAt'];

        if ($score['score'] > $current['score']) {
            $current['name'] = $score['name'];
            $current['score'] = $score['score'];
        }

        $grouped[$identifier] = $current;
    }

    $ranking = array_values($grouped);
    usort($ranking, static fn(array $a, array $b): int => ($b['score'] <=> $a['score']) ?: ($a['attempts'] <=> $b['attempts']));

    return $limit === null ? $ranking : array_slice($ranking, 0, $limit);
}

function wedding_template_build_public_game_ranking(array $scores): array
{
    return array_map(
        static fn(array $entry): array => [
            'name' => $entry['name'],
            'score' => $entry['score'],
            'attempts' => $entry['attempts'],
            'lastPlayedAt' => $entry['lastPlayedAt'],
        ],
        wedding_template_build_private_game_ranking($scores)
    );
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

function wedding_template_get_request_fingerprint(string $scope): string
{
    return hash('sha256', $scope . '|' . wedding_template_get_request_ip());
}

function wedding_template_ensure_public_rate_limit_store(): void
{
    wedding_template_ensure_private_data_directory();

    if (!is_file(WEDDING_TEMPLATE_PUBLIC_RATE_LIMIT_PATH)) {
        file_put_contents(WEDDING_TEMPLATE_PUBLIC_RATE_LIMIT_PATH, '{}', LOCK_EX);
    }

    wedding_template_restrict_private_file(WEDDING_TEMPLATE_PUBLIC_RATE_LIMIT_PATH);
}

function wedding_template_with_public_rate_limit_store(bool $write, callable $callback)
{
    wedding_template_ensure_public_rate_limit_store();
    $handle = fopen(WEDDING_TEMPLATE_PUBLIC_RATE_LIMIT_PATH, 'c+');
    if ($handle === false) {
        throw new RuntimeException('No se pudo abrir la protección antiabuso.');
    }

    try {
        if (!flock($handle, $write ? LOCK_EX : LOCK_SH)) {
            throw new RuntimeException('No se pudo bloquear la protección antiabuso.');
        }

        rewind($handle);
        $raw = stream_get_contents($handle);
        $store = $raw === '' ? [] : json_decode($raw, true);
        if (!is_array($store)) {
            $store = [];
        }

        $result = $callback($store);

        if ($write) {
            $encoded = json_encode($store, JSON_UNESCAPED_SLASHES);
            if (!is_string($encoded)) {
                throw new RuntimeException('No se pudo guardar la protección antiabuso.');
            }
            rewind($handle);
            ftruncate($handle, 0);
            fwrite($handle, $encoded);
            fflush($handle);
        }

        flock($handle, LOCK_UN);
        return $result;
    } finally {
        fclose($handle);
    }
}

function wedding_template_limit_public_submission(string $scope, int $maxAttempts, int $windowSeconds): void
{
    $now = time();
    $fingerprint = wedding_template_get_request_fingerprint($scope);
    $blocked = wedding_template_with_public_rate_limit_store(true, static function (array &$store) use ($now, $fingerprint, $maxAttempts, $windowSeconds): bool {
        foreach ($store as $key => $timestamps) {
            if (!is_array($timestamps)) {
                unset($store[$key]);
                continue;
            }

            $recent = array_values(array_filter(
                $timestamps,
                static fn($timestamp): bool => is_int($timestamp) && $timestamp >= $now - $windowSeconds
            ));
            if ($recent === []) {
                unset($store[$key]);
            } else {
                $store[$key] = $recent;
            }
        }

        $attempts = $store[$fingerprint] ?? [];
        if (count($attempts) >= $maxAttempts) {
            return true;
        }

        $attempts[] = $now;
        $store[$fingerprint] = $attempts;
        return false;
    });

    if ($blocked) {
        header('Retry-After: ' . $windowSeconds);
        wedding_template_fail('Demasiados envíos. Espera unos minutos antes de volver a intentarlo.', 429);
    }
}

function wedding_template_get_login_rate_limit_state(): array
{
    $store = wedding_template_read_login_attempt_store();
    $requestFingerprint = wedding_template_get_request_fingerprint('moderation-login');
    $now = time();
    $entry = isset($store[$requestFingerprint]) && is_array($store[$requestFingerprint]) ? $store[$requestFingerprint] : [];
    $attempts = isset($entry['attempts']) && is_array($entry['attempts']) ? $entry['attempts'] : [];

    $recentAttempts = array_values(array_filter(
        $attempts,
        static fn($value): bool => is_int($value) && $value >= $now - WEDDING_TEMPLATE_LOGIN_WINDOW_SECONDS
    ));

    $blockedUntil = isset($entry['blockedUntil']) && is_int($entry['blockedUntil']) ? $entry['blockedUntil'] : 0;
    $remainingSeconds = max(0, $blockedUntil - $now);

    return [
        'requestFingerprint' => $requestFingerprint,
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

    $state['store'][$state['requestFingerprint']] = [
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

    if (!array_key_exists($state['requestFingerprint'], $state['store'])) {
        return;
    }

    unset($state['store'][$state['requestFingerprint']]);
    wedding_template_write_login_attempt_store($state['store']);
}

function wedding_template_is_authenticated(): bool
{
    wedding_template_start_session();
    if (($_SESSION[WEDDING_TEMPLATE_SESSION_AUTH_KEY] ?? false) !== true) {
        return false;
    }

    $now = time();
    $lastActivity = $_SESSION[WEDDING_TEMPLATE_SESSION_LAST_ACTIVITY_KEY] ?? 0;
    if (!is_int($lastActivity) || $lastActivity < $now - WEDDING_TEMPLATE_SESSION_IDLE_TIMEOUT_SECONDS) {
        wedding_template_logout();
        return false;
    }

    $_SESSION[WEDDING_TEMPLATE_SESSION_LAST_ACTIVITY_KEY] = $now;
    return true;
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
    $_SESSION[WEDDING_TEMPLATE_SESSION_LAST_ACTIVITY_KEY] = time();
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
