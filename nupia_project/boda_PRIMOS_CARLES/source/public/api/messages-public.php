<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $store = wedding_template_read_store();
        wedding_template_send_json([
            'approvedMessages' => $store['approvedMessages'],
        ]);
    }

    if ($method === 'POST') {
        $input = wedding_template_read_json_input();
        $name = isset($input['name']) && is_string($input['name']) ? trim($input['name']) : '';
        $message = isset($input['message']) && is_string($input['message']) ? trim($input['message']) : '';

        if ($name === '' || $message === '') {
            wedding_template_fail('Faltan datos obligatorios.', 422);
        }

        if (wedding_template_string_length($name) < 2 || wedding_template_string_length($name) > 50) {
            wedding_template_fail('El nombre debe tener entre 2 y 50 caracteres.', 422);
        }

        if (wedding_template_string_length($message) < 1 || wedding_template_string_length($message) > 150) {
            wedding_template_fail('El mensaje debe tener entre 1 y 150 caracteres.', 422);
        }

        $store = wedding_template_read_store();
        array_unshift($store['pendingMessages'], [
            'id' => bin2hex(random_bytes(12)),
            'name' => $name,
            'message' => $message,
        ]);

        wedding_template_write_store($store);
        wedding_template_send_json(['ok' => true], 201);
    }

    wedding_template_fail('Método no permitido.', 405);
} catch (Throwable $exception) {
    wedding_template_fail('No se pudo procesar la solicitud.', 500);
}
