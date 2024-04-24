<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = $_POST['first-name'];
    $lastName = $_POST['last-name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $comments = $_POST['comments'];

    $errors = array();
    if (empty($firstName)) {
        $errors[] = "First name is required.";
    }
    if (empty($lastName)) {
        $errors[] = "Last name is required.";
    }
    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode($errors);
        exit();
    }

    $formData = array(
        "first_name" => $firstName,
        "last_name" => $lastName,
        "email" => $email,
        "phone" => $phone,
        "comments" => $comments
    );

    $jsonFormData = json_encode($formData, JSON_PRETTY_PRINT);

    $file = 'data.json';
    if (file_put_contents($file, $jsonFormData, FILE_APPEND | LOCK_EX) === false) {
        http_response_code(500);
        echo json_encode(array("error" => "Failed to save form data."));
        exit();
    }

    $to = "dumidu.kodithuwakku@ebeyonds.com, prabhath.senadheera@ebeyonds.com";
    $subject = "New Form Submission";
    $message = "First Name: $firstName\n";
    $message .= "Last Name: $lastName\n";
    $message .= "Email: $email\n";
    $message .= "Phone: $phone\n";
    $message .= "Comments: $comments\n";

    $headers = "From: $email" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";

    mail($to, $subject, $message, $headers);

    $autoResponseSubject = "Thank you for the submission";
    $autoResponseMessage = "Dear $firstName, Thank you for submitting.";

    mail($email, $autoResponseSubject, $autoResponseMessage, $headers);

    http_response_code(200);
    echo json_encode(array("message" => "Form submitted successfully."));
} else {
    http_response_code(405);
    echo json_encode(array("error" => "Invalid request method."));
}
?>
