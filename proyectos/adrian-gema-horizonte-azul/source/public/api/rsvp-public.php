<?php
declare(strict_types=1);

require_once __DIR__ . '/_rsvp-store.php';

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        wedding_template_fail('Método no permitido.', 405);
    }

    $input = wedding_template_read_json_input();
    if (!empty($input['website'])) {
        wedding_template_send_json(['ok' => true], 201);
    }

    $name = isset($input['name']) && is_string($input['name']) ? trim($input['name']) : '';
    $phone = isset($input['phone']) && is_string($input['phone']) ? trim($input['phone']) : '';
    $attendance = isset($input['attendance']) && is_string($input['attendance']) ? $input['attendance'] : '';
    $companions = $input['companions'] ?? [];

    if (wedding_template_string_length($name) < 2 || wedding_template_string_length($name) > 100) {
        wedding_template_fail('Escribe tu nombre completo (entre 2 y 100 caracteres).', 422);
    }
    $digits = preg_replace('/\D/', '', $phone);
    if (!preg_match('/^\+?[0-9\s().-]{9,24}$/', $phone) || strlen($digits) < 9 || strlen($digits) > 15) {
        wedding_template_fail('Escribe un teléfono de contacto válido.', 422);
    }
    if ($attendance !== 'yes' && $attendance !== 'no') {
        wedding_template_fail('Indica si asistirás.', 422);
    }
    if (!is_array($companions) || count($companions) > 5 || ($attendance === 'no' && $companions !== [])) {
        wedding_template_fail('Revisa los acompañantes.', 422);
    }

    $dietary = $attendance === 'yes' ? wedding_rsvp_clean_dietary($input['dietary'] ?? null) : wedding_rsvp_empty_dietary();
    $cleanCompanions = [];
    foreach ($companions as $companion) {
        if (!is_array($companion) || !isset($companion['name']) || !is_string($companion['name'])) {
            wedding_template_fail('Revisa los nombres de los acompañantes.', 422);
        }
        $companionName = trim($companion['name']);
        if (wedding_template_string_length($companionName) < 2 || wedding_template_string_length($companionName) > 100) {
            wedding_template_fail('Escribe el nombre completo de cada acompañante.', 422);
        }
        $cleanCompanions[] = ['name' => $companionName, 'dietary' => wedding_rsvp_clean_dietary($companion['dietary'] ?? null)];
    }
    $hasDietaryDetails = wedding_rsvp_has_dietary_details($dietary);
    foreach ($cleanCompanions as $companion) {
        $hasDietaryDetails = $hasDietaryDetails || wedding_rsvp_has_dietary_details($companion['dietary']);
    }
    if ($hasDietaryDetails && ($input['dietaryConsent'] ?? false) !== true) {
        wedding_template_fail('Confirma que puedes compartir las necesidades de menú indicadas.', 422);
    }

    wedding_template_start_session();
    $now = time();
    if ($now - (int) ($_SESSION['wedding_rsvp_last_submit'] ?? 0) < 15) {
        wedding_template_fail('Espera unos segundos antes de enviar otra respuesta.', 429);
    }

    wedding_rsvp_with_store(true, static function (array &$entries) use ($name, $phone, $attendance, $dietary, $cleanCompanions, $hasDietaryDetails): void {
        array_unshift($entries, [
            'id' => bin2hex(random_bytes(12)),
            'name' => $name,
            'phone' => $phone,
            'attendance' => $attendance,
            'dietary' => $dietary,
            'companions' => $cleanCompanions,
            'dietaryConsent' => $hasDietaryDetails,
            'submittedAt' => gmdate('c'),
        ]);
    });
    $_SESSION['wedding_rsvp_last_submit'] = $now;

    $notify = wedding_template_read_environment_value('WEDDING_RSVP_NOTIFY_EMAIL');
    if ($notify !== null && filter_var($notify, FILTER_VALIDATE_EMAIL)) {
        @mail($notify, 'Nueva respuesta a la invitación', 'Hay una nueva respuesta de asistencia. Revísala en /es/moderacion.');
    }

    wedding_template_send_json(['ok' => true], 201);
} catch (Throwable $exception) {
    wedding_template_fail('No se pudo guardar la respuesta. Inténtalo más tarde.', 500);
}
