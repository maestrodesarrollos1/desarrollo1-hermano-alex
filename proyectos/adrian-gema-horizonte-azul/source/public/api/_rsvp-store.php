<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

function wedding_rsvp_empty_dietary(): array
{
    return ['allergies' => false, 'allergyDetails' => '', 'intolerances' => false, 'intoleranceDetails' => '', 'vegan' => false, 'pregnant' => false];
}

function wedding_rsvp_clean_dietary($value): array
{
    if (!is_array($value)) {
        wedding_template_fail('Revisa las necesidades de menú.', 422);
    }
    $dietary = wedding_rsvp_empty_dietary();
    foreach (['allergies', 'intolerances', 'vegan', 'pregnant'] as $key) {
        if (isset($value[$key]) && !is_bool($value[$key])) {
            wedding_template_fail('Revisa las necesidades de menú.', 422);
        }
        $dietary[$key] = $value[$key] ?? false;
    }
    foreach (['allergyDetails' => 'allergies', 'intoleranceDetails' => 'intolerances'] as $detailKey => $flagKey) {
        if (isset($value[$detailKey]) && !is_string($value[$detailKey])) {
            wedding_template_fail('Revisa las necesidades de menú.', 422);
        }
        $detail = $dietary[$flagKey] ? trim($value[$detailKey] ?? '') : '';
        if ($dietary[$flagKey] && (wedding_template_string_length($detail) < 2 || wedding_template_string_length($detail) > 250)) {
            wedding_template_fail('Concreta las alergias o intolerancias seleccionadas.', 422);
        }
        $dietary[$detailKey] = $detail;
    }
    return $dietary;
}

function wedding_rsvp_has_dietary_details(array $dietary): bool
{
    return $dietary['allergies'] || $dietary['intolerances'] || $dietary['vegan'] || $dietary['pregnant'];
}

function wedding_rsvp_store_path(): string
{
    $configured = wedding_template_read_environment_value('WEDDING_RSVP_STORE_PATH');
    return $configured ?? dirname(__DIR__, 2) . '/_private/rsvp.json';
}

function wedding_rsvp_with_store(bool $write, callable $callback)
{
    $path = wedding_rsvp_store_path();
    $directory = dirname($path);
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('No se pudo crear el directorio privado de RSVP.');
    }

    $handle = fopen($path, 'c+');
    if ($handle === false) {
        throw new RuntimeException('No se pudo abrir el registro de RSVP.');
    }

    try {
        if (!flock($handle, $write ? LOCK_EX : LOCK_SH)) {
            throw new RuntimeException('No se pudo bloquear el registro de RSVP.');
        }

        rewind($handle);
        $raw = stream_get_contents($handle);
        $entries = $raw === '' ? [] : json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($entries)) {
            throw new RuntimeException('El registro de RSVP no tiene un formato válido.');
        }

        $result = $callback($entries);
        if ($write) {
            $encoded = json_encode($entries, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
            rewind($handle);
            if (!ftruncate($handle, 0) || fwrite($handle, $encoded) !== strlen($encoded) || !fflush($handle)) {
                throw new RuntimeException('No se pudo guardar el registro de RSVP.');
            }
        }

        flock($handle, LOCK_UN);
        return $result;
    } finally {
        fclose($handle);
    }
}

function wedding_rsvp_summary(array $entries): array
{
    $yes = 0;
    $no = 0;
    $guests = 0;
    $pending = 0;
    $accepted = 0;
    foreach ($entries as $entry) {
        if (($entry['attendance'] ?? '') === 'yes') {
            $yes++;
            $guests += 1 + count($entry['companions'] ?? []);
        } else {
            $no++;
        }
        if (($entry['reviewStatus'] ?? 'pending') === 'accepted') {
            $accepted++;
        } else {
            $pending++;
        }
    }
    return ['yes' => $yes, 'no' => $no, 'guests' => $guests, 'pending' => $pending, 'accepted' => $accepted];
}
