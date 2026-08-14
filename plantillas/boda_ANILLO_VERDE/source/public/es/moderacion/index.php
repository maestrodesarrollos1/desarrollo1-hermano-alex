<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/api/_bootstrap.php';

$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $password = isset($_POST['password']) && is_string($_POST['password']) ? trim($_POST['password']) : '';
    $rateLimitState = wedding_template_get_login_rate_limit_state();

    if ($rateLimitState['remainingSeconds'] > 0) {
        $error = wedding_template_format_rate_limit_message($rateLimitState['remainingSeconds']);
    } elseif ($password !== '' && wedding_template_verify_password($password)) {
        wedding_template_clear_failed_logins();
        wedding_template_mark_authenticated();
        header('Location: /es/moderacion');
        exit;
    } else {
        wedding_template_record_failed_login();
        $error = 'Contraseña incorrecta.';
    }
}

if (!wedding_template_is_authenticated()) {
    http_response_code(401);
    wedding_template_send_security_headers();
    wedding_template_send_no_cache_headers();
    ?>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Moderación privada</title>
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        background: #f8fcf8;
        color: #0f3d2e;
        font-family: "Soho Pro", "Helvetica Neue", Arial, sans-serif;
      }

      .card {
        width: min(100%, 40rem);
        border: 1px solid #ddece0;
        background: #ffffff;
        padding: 2rem;
        box-shadow: 0 16px 40px rgba(15, 61, 46, 0.06);
      }

      .eyebrow {
        margin: 0;
        font-size: 0.75rem;
        letter-spacing: 0.36em;
        text-transform: uppercase;
        color: #7faf8e;
      }

      h1 {
        margin: 1rem 0 0;
        font-family: Georgia, serif;
        font-size: clamp(2.8rem, 7vw, 4.25rem);
        font-weight: 400;
        color: #0f3d2e;
      }

      p {
        margin: 1.5rem 0 0;
        font-size: 1rem;
        line-height: 1.9;
        color: #1f5e46;
      }

      form {
        margin-top: 2rem;
      }

      input,
      button {
        width: 100%;
        font: inherit;
      }

      input {
        border: 1px solid #eaf6ec;
        padding: 0.95rem 1rem;
        color: #0f3d2e;
      }

      button {
        margin-top: 1rem;
        border: 1px solid #0f3d2e;
        background: #0f3d2e;
        padding: 1rem 1.2rem;
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 0.28em;
        cursor: pointer;
      }

      .error {
        margin-top: 1rem;
        color: #a14848;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <p class="eyebrow">Moderación</p>
      <h1>Acceso privado</h1>
      <p>Introduce la contraseña para revisar mensajes pendientes y borrar mensajes ya publicados.</p>
      <form method="post" action="/es/moderacion">
        <input type="password" name="password" placeholder="Contraseña" autocomplete="current-password" />
        <button type="submit">Entrar</button>
      </form>
      <?php if ($error !== ''): ?>
        <p class="error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
      <?php endif; ?>
    </main>
  </body>
</html>
    <?php
    exit;
}

$indexPath = dirname(__DIR__, 2) . '/index.html';

if (!is_file($indexPath)) {
    http_response_code(500);
    echo 'No se pudo cargar la aplicación.';
    exit;
}

wedding_template_send_security_headers();
wedding_template_send_no_cache_headers();
readfile($indexPath);
