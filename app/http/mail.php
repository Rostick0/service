<?

function protectionData($data) {
    $data = htmlspecialchars($data);
    $data = trim($data);

    return $data;
}

function sendMail($data) {
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);

    $name = $data['name'];
    $telephone = $data['telephone'];
    $text = $data['text'];

    // почта для получения
    $to = "globus_2022@list.ru";
    // почта для отправки (нужно установить хостинговую)
    $from = "zajcevav30@gmail.com";
    $subject = "Сообщение от клиента";
    $headers = "From: $from" . "\r\n" . 
    "Reply-To: $from" . "\r\n" . 
    "X-Mailer: PHP/" . phpversion();
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    $message = "<p><strong>Имя:</strong><span>$name</span></p>"
                . "<p><strong>Телефон:</strong><span>$telephone</span></p>"
                . "<p><strong>Сообщение:</strong><span>$text</span></p>";

    if (mail($to, $subject, $message, $headers)) {
        http_response_code(201);

        $message = [
            'message' => 'Письмо отправлено',
            'status' => true
        ];
    } else {
        http_response_code(401);

        $message = [
            'message' => 'Письмо не было отправлено',
            'status' => false
        ];
    }

    echo json_encode($message);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    sendMail($_POST);
}

?>