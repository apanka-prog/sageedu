<?php

// Only run this code if the form was actually submitted
// If someone tries to visit this file directly in a browser, kick them back home
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// strip_tags removes any HTML someone might try to inject
// trim removes accidental spaces at the start/end
// ?? '' means "use empty string if this field wasn't sent"

$first_name = htmlspecialchars(strip_tags(trim($_POST['first_name'] ?? '')));
$last_name  = htmlspecialchars(strip_tags(trim($_POST['last_name']  ?? '')));
$company    = htmlspecialchars(strip_tags(trim($_POST['company']    ?? '')));
$org_type   = htmlspecialchars(strip_tags(trim($_POST['org_type']   ?? '')));
$message    = htmlspecialchars(strip_tags(trim($_POST['message']    ?? '')));

// Email gets its own sanitizer since it has specific formatting rules
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);

// Check that the required fields actually have content

$errors = [];

if (empty($first_name))                          $errors[] = 'First name is required.';
if (empty($last_name))                           $errors[] = 'Last name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))  $errors[] = 'A valid email is required.';
if (empty($message))                             $errors[] = 'Message is required.';

// If there are any errors, send them back to the form
if (!empty($errors)) {
    header('Location: index.html?sent=error');
    exit;
}

$to = 'info@sageeducon.com';

$subject = 'New inquiry from ' . $first_name . ' ' . $last_name;

// The body of the email Lisa will receive
$body  = "You have a new inquiry from the Sage Education Consulting website.\n\n";
$body .= "-------------------------------------------\n";
$body .= "Name:              " . $first_name . " " . $last_name . "\n";
$body .= "Email:             " . $email      . "\n";
$body .= "Organization:      " . $company    . "\n";
$body .= "Organization Type: " . $org_type   . "\n";
$body .= "-------------------------------------------\n\n";
$body .= "Message:\n" . $message . "\n";

// Headers tell the mail server who sent it and where to reply
// Reply-To means Lisa can hit Reply in her email and it goes to the person who submitted
$headers  = 'From: website@sageeducon.com'  . "\r\n";
$headers .= 'Reply-To: ' . $email           . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";

if (mail($to, $subject, $body, $headers)) {
    // Success — redirect back with a flag in the URL
    header('Location: index.html?sent=true');
    exit;
} else {
    // Something went wrong with the mail server
    header('Location: index.html?sent=error');
    exit;
}
?>