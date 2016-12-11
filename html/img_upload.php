<?php

//$data = file_get_contents('php://input');

var_dump($_POST);
$base64img = urldecode($_POST['img']);

// remove the part that we don't need from the provided image and decode it
$base64img = str_replace('data:image/png;base64,', '', $base64img);
$data = base64_decode($base64img);

$timestamp = date("YmdHis");
$filepath = "gallery/preview/photo_" . $timestamp . ".png"; // or image.jpg
// Save the image in a defined path
file_put_contents($filepath,$data);
echo $filepath
?>
