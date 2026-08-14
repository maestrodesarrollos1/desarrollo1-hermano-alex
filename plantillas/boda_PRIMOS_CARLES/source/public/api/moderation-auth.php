<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $authenticated = wedding_template_is_authenticated();

        wedding_template_send_json([
            'authenticated' => $authenticated,
            'csrfToken' => $authenticated ? wedding_template_get_csrf_token() : null,
        ]);
    }

    if ($method === 'POST') {
        $input = wedding_template_read_json_input();
        $action = isset($input['action']) && is_string($input['action']) ? $input['action'] : '';

        if ($action === 'logout') {
            wedding_template_logout();
            wedding_template_send_json([
                'authenticated' => false,
                'csrfToken' => null,
            ]);
        }

        if ($action !== 'login') {
            wedding_template_fail('Acción no válida.', 400);
        }

        wedding_template_require_login_attempt_available();
        $password = isset($input['password']) && is_string($input['password']) ? trim($input['password']) : '';
        if ($password === '' || !wedding_template_verify_password($password)) {
            wedding_template_record_failed_login();
            wedding_template_fail('Contraseña incorrecta.', 401);
        }

        wedding_template_clear_failed_logins();
        wedding_template_mark_authenticated();
        wedding_template_send_json([
            'authenticated' => true,
            'csrfToken' => wedding_template_get_csrf_token(),
        ]);
    }

    wedding_template_fail('Método no permitido.', 405);
} catch (Throwable $exception) {
    wedding_template_fail('No se pudo procesar la autenticación.', 500);
}
