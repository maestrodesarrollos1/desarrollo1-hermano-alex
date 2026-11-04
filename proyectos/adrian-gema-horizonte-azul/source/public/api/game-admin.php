<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

function wedding_template_game_csv_cell(string $value): string
{
    if (preg_match('/^\s*[=+\-@]/u', $value) === 1) {
        $value = "'" . $value;
    }

    return '"' . str_replace('"', '""', $value) . '"';
}

function wedding_template_game_display_date(string $value): string
{
    try {
        return (new DateTimeImmutable($value))
            ->setTimezone(new DateTimeZone('Europe/Madrid'))
            ->format('d/m/Y H:i');
    } catch (Throwable $exception) {
        return $value;
    }
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
        wedding_template_fail('Metodo no permitido.', 405);
    }

    wedding_template_require_authentication();
    $store = wedding_template_read_game_store();
    $ranking = wedding_template_build_private_game_ranking($store['scores'], null);
    $format = isset($_GET['format']) && is_string($_GET['format']) ? $_GET['format'] : '';

    if ($format === 'csv') {
        wedding_template_send_security_headers();
        wedding_template_send_no_cache_headers();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="ranking-reto-boda.csv"');
        echo "\xEF\xBB\xBF";
        echo implode(';', array_map('wedding_template_game_csv_cell', [
            'Posición', 'Nombre', 'Correo', 'Puntos', 'Intentos', 'Última participación',
        ])) . "\r\n";

        foreach ($ranking as $index => $entry) {
            echo implode(';', array_map('wedding_template_game_csv_cell', [
                (string) ($index + 1),
                $entry['name'],
                $entry['email'],
                (string) $entry['score'],
                (string) $entry['attempts'],
                wedding_template_game_display_date($entry['lastPlayedAt']),
            ])) . "\r\n";
        }
        exit;
    }

    wedding_template_send_json([
        'ranking' => $ranking,
        'cutoffAt' => wedding_template_game_cutoff_at(),
    ]);
} catch (Throwable $exception) {
    wedding_template_fail('No se pudo cargar el ranking privado.', 500);
}
