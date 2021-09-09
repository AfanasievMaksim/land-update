<?php
if (isset($_POST['from']) && isset($_POST['to'])) {
    $from = $_POST['from'];
    $to = $_POST['to'];
    $DOM = new DOMDocument();
    @$DOM->loadHTMLFile("https://transferwise.com/gb/currency-converter/$from-to-$to-rate");
    $xpath = new DOMXPath($DOM);

    $course_node =
        $xpath->query('//*[contains(concat( " ", @class, " " ), concat( " ", "text-lg-left", " " ))]//*[contains(concat( " ", @class, " " ), concat( " ", "text-success", " " ))]');
    $course = $course_node->item(0)->nodeValue;

    echo json_encode(['course' => $course]);
}
elseif(!empty($_POST['phone']) && !empty($_POST['name'])){
    $message = wordwrap("Phone: " . $_POST['phone'] . ". Name: " . $_POST['name']);
    mail('salesforce.whitemark.phoname@gmail.com', 'Sunshine Horizont',$message);
}
elseif (!empty($_POST['phone'])){
    $message = wordwrap("Phone: " . $_POST['phone']);
    mail('salesforce.whitemark@gmail.com', 'Sunshine Horizont',$message);
}
