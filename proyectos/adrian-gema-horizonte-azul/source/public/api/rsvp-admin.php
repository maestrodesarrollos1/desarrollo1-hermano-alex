<?php
declare(strict_types=1);

require_once __DIR__ . '/_rsvp-store.php';

try {
    wedding_template_require_authentication();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $entries = wedding_rsvp_with_store(false, static fn(array &$items): array => $items);

        if (($_GET['format'] ?? '') === 'csv') {
            wedding_template_send_security_headers();
            wedding_template_send_no_cache_headers();
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="confirmaciones-boda.csv"');
            $output = fopen('php://output', 'w');
            if ($output === false) {
                throw new RuntimeException('No se pudo crear el CSV.');
            }
            fwrite($output, "\xEF\xBB\xBF");
            fputcsv($output, ['Fecha', 'Estado', 'Contacto', 'Teléfono', 'Asistencia', 'Persona', 'Tipo', 'Alergias', 'Intolerancias', 'Vegano/a', 'Embarazada', 'Comentario'], ';');
            foreach ($entries as $entry) {
                $people = [['name' => (string) ($entry['name'] ?? ''), 'dietary' => $entry['dietary'] ?? [], 'role' => 'Titular']];
                if (($entry['attendance'] ?? '') === 'yes') {
                    foreach ($entry['companions'] ?? [] as $companion) {
                        $people[] = is_array($companion)
                            ? ['name' => (string) ($companion['name'] ?? ''), 'dietary' => $companion['dietary'] ?? [], 'role' => 'Acompañante']
                            : ['name' => (string) $companion, 'dietary' => [], 'role' => 'Acompañante'];
                    }
                }
                foreach ($people as $person) {
                    $dietary = is_array($person['dietary']) ? $person['dietary'] : [];
                    $cells = [
                        (string) ($entry['submittedAt'] ?? ''),
                        ($entry['reviewStatus'] ?? 'pending') === 'accepted' ? 'Aceptada' : 'Pendiente',
                        (string) ($entry['name'] ?? ''),
                        (string) ($entry['phone'] ?? $entry['email'] ?? ''),
                        ($entry['attendance'] ?? '') === 'yes' ? 'Sí' : 'No',
                        $person['name'],
                        $person['role'],
                        !empty($dietary['allergies']) ? (string) ($dietary['allergyDetails'] ?? '') : '',
                        !empty($dietary['intolerances']) ? (string) ($dietary['intoleranceDetails'] ?? '') : '',
                        !empty($dietary['vegan']) ? 'Sí' : 'No',
                        !empty($dietary['pregnant']) ? 'Sí' : 'No',
                        (string) ($entry['comment'] ?? ''),
                    ];
                    $cells = array_map(static fn(string $value): string => preg_match('/^[\s]*[=+\-@]/u', $value) ? "'" . $value : $value, $cells);
                    fputcsv($output, $cells, ';');
                }
            }
            fclose($output);
            exit;
        }

        wedding_template_send_json(['entries' => $entries, 'summary' => wedding_rsvp_summary($entries)]);
    }

    if ($method === 'POST') {
        $input = wedding_template_read_json_input();
        wedding_template_require_csrf($input);
        $action = $input['action'] ?? '';
        if (!is_string($action) || !isset($input['id']) || !is_string($input['id'])) {
            wedding_template_fail('Acción no válida.', 400);
        }
        $id = $input['id'];
        if ($action === 'set-status') {
            $reviewStatus = $input['reviewStatus'] ?? '';
            if ($reviewStatus !== 'pending' && $reviewStatus !== 'accepted') {
                wedding_template_fail('Estado no válido.', 422);
            }
            $updated = wedding_rsvp_with_store(true, static function (array &$entries) use ($id, $reviewStatus): bool {
                foreach ($entries as &$entry) {
                    if (($entry['id'] ?? '') === $id) {
                        $entry['reviewStatus'] = $reviewStatus;
                        return true;
                    }
                }
                unset($entry);
                return false;
            });
            if (!$updated) {
                wedding_template_fail('Respuesta no encontrada.', 404);
            }
            wedding_template_send_json(['ok' => true]);
        }
        if ($action !== 'delete') {
            wedding_template_fail('Acción no válida.', 400);
        }
        $deleted = wedding_rsvp_with_store(true, static function (array &$entries) use ($id): bool {
            $before = count($entries);
            $entries = array_values(array_filter($entries, static fn($entry): bool => ($entry['id'] ?? '') !== $id));
            return count($entries) !== $before;
        });
        if (!$deleted) {
            wedding_template_fail('Respuesta no encontrada.', 404);
        }
        wedding_template_send_json(['ok' => true]);
    }

    wedding_template_fail('Método no permitido.', 405);
} catch (Throwable $exception) {
    wedding_template_fail('No se pudo procesar el registro de confirmaciones.', 500);
}
