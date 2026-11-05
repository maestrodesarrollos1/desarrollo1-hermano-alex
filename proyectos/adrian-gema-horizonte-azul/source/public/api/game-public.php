<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        wedding_template_send_json([
            'message' => 'El resultado se desvelará el día de la boda.',
        ]);
    }

    if ($method === 'POST') {
        $cutoff = wedding_template_game_cutoff_at();
        if ($cutoff !== null) {
            $cutoffTimestamp = strtotime($cutoff);
            if ($cutoffTimestamp !== false && time() > $cutoffTimestamp) {
                wedding_template_fail('El juego ya esta cerrado.', 403);
            }
        }

        $input = wedding_template_read_json_input();
        $name = isset($input['name']) && is_string($input['name']) ? trim($input['name']) : '';
        $rawPhone = isset($input['phone']) && is_string($input['phone']) ? $input['phone'] : '';
        $phone = wedding_template_normalize_game_phone($rawPhone);
        $score = isset($input['score']) && is_int($input['score']) ? $input['score'] : -1;

        if ($name === '' || $rawPhone === '' || $score < 0) {
            wedding_template_fail('Faltan datos obligatorios.', 422);
        }

        if (wedding_template_string_length($name) < 2 || wedding_template_string_length($name) > 50) {
            wedding_template_fail('El nombre debe tener entre 2 y 50 caracteres.', 422);
        }

        if ($phone === null) {
            wedding_template_fail('El teléfono no es válido.', 422);
        }

        if ($score > 999) {
            wedding_template_fail('La puntuacion no es valida.', 422);
        }

        $store = wedding_template_read_game_store();
        $attemptNumber = 1;

        foreach ($store['scores'] as $item) {
            if (isset($item['phone']) && $item['phone'] === $phone) {
                $attemptNumber++;
            }
        }

        $store['scores'][] = [
            'id' => bin2hex(random_bytes(12)),
            'name' => $name,
            'phone' => $phone,
            'score' => $score,
            'createdAt' => gmdate('c'),
        ];

        wedding_template_write_game_store($store);
        wedding_template_send_json([
            'ok' => true,
            'attemptNumber' => $attemptNumber,
        ], 201);
    }

    wedding_template_fail('Metodo no permitido.', 405);
} catch (Throwable $exception) {
    wedding_template_fail('No se pudo procesar la puntuacion.', 500);
}
