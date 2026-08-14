<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

try {
    $token = isset($_GET['token']) && is_string($_GET['token']) ? trim($_GET['token']) : '';
    $expectedToken = wedding_template_read_environment_value('WEDDING_GAME_REPORT_TOKEN');

    if ($expectedToken === null || $token === '' || !hash_equals($expectedToken, $token)) {
        wedding_template_fail('No autorizado.', 401);
    }

    $recipient = wedding_template_read_environment_value('WEDDING_GAME_REPORT_TO');
    if ($recipient === null || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        wedding_template_fail('Falta configurar WEDDING_GAME_REPORT_TO.', 500);
    }

    $store = wedding_template_read_game_store();
    $ranking = wedding_template_build_private_game_ranking($store['scores']);
    $lines = [
        'Ranking del juego de la boda',
        '',
    ];

    foreach ($ranking as $index => $entry) {
        $lines[] = sprintf(
            '%d. %s <%s> - %d puntos - %d intento%s - ultima partida: %s',
            $index + 1,
            $entry['name'],
            $entry['email'],
            $entry['score'],
            $entry['attempts'],
            $entry['attempts'] === 1 ? '' : 's',
            $entry['lastPlayedAt']
        );
    }

    if ($ranking === []) {
        $lines[] = 'Todavia no hay participantes.';
    }

    $subject = 'Ranking del juego de la boda';
    $message = implode("\n", $lines);
    $headers = [
        'Content-Type: text/plain; charset=utf-8',
    ];

    $sent = mail($recipient, $subject, $message, implode("\r\n", $headers));

    wedding_template_send_json([
        'ok' => $sent,
        'sentTo' => $recipient,
        'ranking' => $ranking,
    ], $sent ? 200 : 500);
} catch (Throwable $exception) {
    wedding_template_fail('No se pudo generar el informe.', 500);
}
