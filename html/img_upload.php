<?php

//$data = file_get_contents('php://input');

$base64img = urldecode($_POST['img']);

// remove the part that we don't need from the provided image and decode it
$base64img = str_replace('data:image/png;base64,', '', $base64img);
$data = base64_decode($base64img);

$timestamp  = date("YmdHis");
$filepath   = "gallery/preview/photo_" . $timestamp . ".png"; // or image.jpg
$filepathgs = "gallery/processed/photo_" . $timestamp . ".png"; // or image.jpg
// Save the image in a defined path
file_put_contents($filepath,$data);

//convert photo_20161211162531.png -strip -colorspace gray -resize "800x600>" -depth 4 -rotate "90" -type palette test.png
exec('convert ' . $filepath . ' -strip -colorspace gray -resize "800x600>" -depth 4 -rotate "90" -type palette ' . $filepathgs );

echo "photo_" . $timestamp . ".png"
?>
