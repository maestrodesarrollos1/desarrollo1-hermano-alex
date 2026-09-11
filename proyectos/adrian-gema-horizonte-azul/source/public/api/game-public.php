<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $store = wedding_template_read_game_store();
        wedding_template_send_json([
            'ranking' => wedding_template_build_public_game_ranking($store['scores']),
        ]);
    }

    if ($method === 'POST') {
        $cutoff = wedding_template_read_environment_value('WEDDING_GAME_CUTOFF_AT');
        if ($cutoff !== null) {
            $cutoffTimestamp = strtotime($cutoff);
            if ($cutoffTimestamp !== false && time() > $cutoffTimestamp) {
                wedding_template_fail('El juego ya esta cerrado.', 403);
            }
        }

        $input = wedding_template_read_json_input();
        $name = isset($input['name']) && is_string($input['name']) ? trim($input['name']) : '';
        $email = isset($input['email']) && is_string($input['email']) ? strtolower(trim($input['email'])) : '';
        $score = isset($input['score']) && is_int($input['score']) ? $input['score'] : -1;

        if ($name === '' || $email === '' || $score < 0) {
            wedding_template_fail('Faltan datos obligatorios.', 422);
        }

        if (wedding_template_string_length($name) < 2 || wedding_template_string_length($name) > 50) {
            wedding_template_fail('El nombre debe tener entre 2 y 50 caracteres.', 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || wedding_template_string_length($email) > 120) {
            wedding_template_fail('El email no es valido.', 422);
        }

        if ($score > 999) {
            wedding_template_fail('La puntuacion no es valida.', 422);
        }

        $store = wedding_template_read_game_store();
        $attemptNumber = 1;

        foreach ($store['scores'] as $item) {
            if (isset($item['email']) && $item['email'] === $email) {
                $attemptNumber++;
            }
        }

        $store['scores'][] = [
            'id' => bin2hex(random_bytes(12)),
            'name' => $name,
            'email' => $email,
            'score' => $score,
            'createdAt' => gmdate('c'),
        ];

        wedding_template_write_game_store($store);
        wedding_template_send_json([
            'ok' => true,
            'attemptNumber' => $attemptNumber,
            'ranking' => wedding_template_build_public_game_ranking($store['scores']),
        ], 201);
    }

    wedding_template_fail('Metodo no permitido.', 405);
} catch (Throwable $exception) {
    wedding_template_fail('No se pudo procesar la puntuacion.', 500);
}
