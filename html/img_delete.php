<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
include 'config.php';

#Basic Auth to Restrict Access to Frame Configuration
if (!isset($_SERVER['PHP_AUTH_USER'])) :
   header('WWW-Authenticate: Basic realm="sophframemain"');
   header('HTTP/1.0 401 Unauthorized');
   exit;
elseif( check_user( $_SERVER['PHP_AUTH_USER'] , $_SERVER['PHP_AUTH_PW'] )) :

    //Make sure that it is a POST request.
    if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0){
        throw new Exception('Request method must be POST!');
    }

   $delList = $_REQUEST['delList'];
   foreach( $delList as $item) {
     unlink($item);
   }

else:
    header('WWW-Authenticate: Basic realm="sophframemain"');
    header('HTTP/1.0 401 Unauthorized');
endif;
?>
