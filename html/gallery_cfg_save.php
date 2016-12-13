<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

#Basic Auth to Restrict Access to Frame Configuration
if (!isset($_SERVER['PHP_AUTH_USER'])) :
    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'You Must Enter a User Name & Password!';
    exit;
elseif( ($_SERVER['PHP_AUTH_USER'] == 'sophie') && 
          ($_SERVER['PHP_AUTH_PW'] == 'cookie')      ) :
    //Make sure that it is a POST request.
    if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0){
        throw new Exception('Request method must be POST!');
    }
    //Make sure that the content type of the POST request has been set to application/json
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    if(strcasecmp($contentType, 'application/json') != 0){
        throw new Exception('Content type must be: application/json, got: '. $contentType );
    }
     
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));
    // Save to test.json
    file_put_contents( "gallery/gallery.json" , $content . "\n" );
endif;
?>
