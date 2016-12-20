<?php

include 'config.php';

#Basic Auth to Restrict Access to Frame Configuration
if (!isset($_SERVER['PHP_AUTH_USER'])) :
   header('WWW-Authenticate: Basic realm="sophframemain"');
   header('HTTP/1.0 401 Unauthorized');
   exit;
elseif( check_user( $_SERVER['PHP_AUTH_USER'] , $_SERVER['PHP_AUTH_PW'] )) :

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
   exec('convert ' . $filepath . ' -strip -colorspace gray -resize "800x600>" -depth 8 -rotate "90" -type palette ' . $filepathgs );

   echo "photo_" . $timestamp . ".png"
else:
    header('WWW-Authenticate: Basic realm="sophframemain"');
    header('HTTP/1.0 401 Unauthorized');
endif;
?>
