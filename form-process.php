<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form data
    $name = filter_var(trim($_POST["name"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = isset($_POST["phone"]) ? filter_var(trim($_POST["phone"]), FILTER_SANITIZE_STRING) : '';
    $subject = isset($_POST["subject"]) ? filter_var(trim($_POST["subject"]), FILTER_SANITIZE_STRING) : 'Website Inquiry';
    $message = filter_var(trim($_POST["message"]), FILTER_SANITIZE_STRING);
    
    // Determine which form was submitted
    $formSource = "SSA Website Contact Form";
    
    // Validate data
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo "Please fill in all required fields.";
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please enter a valid email address.";
        exit;
    }
    
    // Prepare email content
    $email_subject = "New Message from SSA Website: $subject";
    $email_body = "You have received a new message from the Sample School website.\n\n";
    $email_body .= "Name: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Phone: " . ($phone ? $phone : "Not provided") . "\n";
    $email_body .= "Subject: $subject\n\n";
    $email_body .= "Message:\n$message\n";
    
    $email_headers = "From: SSA Website <noreply@SSA.edu.gh>\r\n";
    $email_headers .= "Reply-To: $name <$email>\r\n";
    $email_headers .= "X-Mailer: PHP/" . phpversion();
    $email_headers .= "MIME-Version: 1.0\r\n";
    $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email
    $recipient = "Paul.antwi@SSA.edu.gh";
    
    if (mail($recipient, $email_subject, $email_body, $email_headers)) {
        http_response_code(200);
        echo "success";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong. Please try again later.";
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission. Please try again.";
}
?>