<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

//////////////////////////////////////////////
//
// INITIALIZATION
//
//////////////////////////////////////////////

//Create TMP directory
if (!file_exists('cfg/tmp')) { //If no tmp exists create
  mkdir('cfg/tmp', 0777, true);
} else {                       // Else empty contents
  $files = glob('cfg/tmp/*'); // get all file names
  foreach($files as $file){ // iterate files
    if(is_file($file))
      unlink($file); // delete file
  }
}


//////////////////////////////////////////////
//
// PHOTOS_*_TAR.GZ GENERATION
//
//////////////////////////////////////////////



// Archive and Compress
/*
try
{
    $a = new PharData('cfg/tmp/tmp.tar');

    // ADD FILES TO archive.tar FILE
    $a->addFile('data.xls');

    // COMPRESS archive.tar FILE. COMPRESSED FILE WILL BE archive.tar.gz
    $a->compress(Phar::GZ);

    // NOTE THAT BOTH FILES WILL EXISTS. SO IF YOU WANT YOU CAN UNLINK archive.tar
    unlink('cfg/tmp/tmp.tar');
} 
catch (Exception $e) 
{
    echo "Exception : " . $e;
}
*/
//////////////////////////////////////////////
//
// FRAME_CFG GENERATION
//
//////////////////////////////////////////////

//Generate ID from UNIX Epoch time, modulo by 32bit to protect against 2038 roll over.
$id_dec = (date_timestamp_get(date_create()) % (2**32));
$id_hex = strtoupper(dechex($id_dec));

//Photo Tar String 
$ph_tar = "cfg/photos_" . $id_hex . ".tar.gz";
$ph_url = "http://labs.justabitmatt.com/frame/" . $ph_tar;

//Photo Time String (TODO: MAKE CONFIGURABLE)
$ph_tim = "00000010";

//Generate Frame Config Text and save to file
$frm_cfg = '<ID>'        . $id_hex . '</ID>'        . "\n" .
           '<PHOTOTIME>' . $ph_tim . '</PHOTOTIME>' . "\n" .
           '<PHOTOTAR>'  . $ph_url . '</PHOTOTAR>'  . "\n";

file_put_contents( "cfg/tmp/test.cfg" , $frm_cfg );

//////////////////////////////////////////////
//
// FINALIZATION
//
//////////////////////////////////////////////

//Remove tmp area
//rmdir('cfg/tmp');
?>
