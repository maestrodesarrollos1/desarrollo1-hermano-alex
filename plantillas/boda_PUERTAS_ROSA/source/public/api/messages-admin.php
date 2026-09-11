<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

try {
    wedding_template_require_authentication();

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $store = wedding_template_read_store();

        wedding_template_send_json([
            'authenticated' => true,
            'csrfToken' => wedding_template_get_csrf_token(),
            'pendingMessages' => $store['pendingMessages'],
            'approvedMessages' => $store['approvedMessages'],
        ]);
    }

    if ($method === 'POST') {
        $input = wedding_template_read_json_input();
        wedding_template_require_csrf($input);

        $action = isset($input['action']) && is_string($input['action']) ? $input['action'] : '';
        $messageId = isset($input['messageId']) && is_string($input['messageId']) ? trim($input['messageId']) : '';

        if ($messageId === '') {
            wedding_template_fail('Falta el identificador del mensaje.', 422);
        }

        $store = wedding_template_read_store();

        if ($action === 'approve') {
            $targetMessage = null;

            foreach ($store['pendingMessages'] as $item) {
                if ($item['id'] === $messageId) {
                    $targetMessage = $item;
                    break;
                }
            }

            if ($targetMessage === null) {
                wedding_template_fail('No se encontró el mensaje pendiente.', 404);
            }

            $store['pendingMessages'] = array_values(array_filter(
                $store['pendingMessages'],
                static fn(array $item): bool => $item['id'] !== $messageId
            ));

            $store['approvedMessages'] = array_values(array_filter(
                $store['approvedMessages'],
                static fn(array $item): bool => $item['id'] !== $messageId
            ));

            array_unshift($store['approvedMessages'], $targetMessage);
            wedding_template_write_store($store);
            wedding_template_send_json(['ok' => true]);
        }

        if ($action === 'delete-pending') {
            $store['pendingMessages'] = array_values(array_filter(
                $store['pendingMessages'],
                static fn(array $item): bool => $item['id'] !== $messageId
            ));

            wedding_template_write_store($store);
            wedding_template_send_json(['ok' => true]);
        }

        if ($action === 'delete-approved') {
            $store['approvedMessages'] = array_values(array_filter(
                $store['approvedMessages'],
                static fn(array $item): bool => $item['id'] !== $messageId
            ));

            wedding_template_write_store($store);
            wedding_template_send_json(['ok' => true]);
        }

        wedding_template_fail('Acción no válida.', 400);
    }

    wedding_template_fail('Método no permitido.', 405);
} catch (Throwable $exception) {
    wedding_template_fail('No se pudo procesar la moderación.', 500);
}
