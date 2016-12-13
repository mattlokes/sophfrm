<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

function rmdir_recursive($dir) {
    foreach(scandir($dir) as $file) {
        if ('.' === $file || '..' === $file) continue;
        if (is_dir("$dir/$file")) rmdir_recursive("$dir/$file");
        else unlink("$dir/$file");
    }
    rmdir($dir);
}

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

$config = json_decode(file_get_contents("gallery/gallery.json"), true);
//var_dump($config);

//Generate ID from UNIX Epoch time, modulo by 32bit to protect against 2038 roll over.
$id_dec = (date_timestamp_get(date_create()) % (2**32));
$id_hex = strtoupper(dechex($id_dec));

//////////////////////////////////////////////
//
// PHOTOS_*_TAR.GZ GENERATION
//
//////////////////////////////////////////////

$count = 0;

foreach($config as $item){
   if ($item['show']) {
     copy( $item['procPhotoPath'], 'cfg/tmp/photo_' . $count . '.png');
     $count = $count + 1;
   }
}

// Archive and Compress

try
{
    $a = new PharData('cfg/tmp/tmp.tar');

    // ADD FILES TO archive.tar FILE
    for($i=0 ; $i < $count; $i++ ) {
      $ph_name = 'photo_'. $i . '.png';
      $a->addFile('cfg/tmp/' . $ph_name  ,
                  $ph_name );
    }

    // COMPRESS archive.tar FILE. COMPRESSED FILE WILL BE archive.tar.gz
    $a->compress(Phar::GZ);

    // NOTE THAT BOTH FILES WILL EXISTS. SO IF YOU WANT YOU CAN UNLINK archive.tar
    unlink('cfg/tmp/tmp.tar');

    // Delete all photos
    for($i=0 ; $i < $count; $i++ ) {
      unlink('cfg/tmp/photo_'. $i . '.png');
    }
} 
catch (Exception $e) 
{
    echo "Exception : " . $e;
}

//////////////////////////////////////////////
//
// FRAME_CFG GENERATION
//
//////////////////////////////////////////////


//Photo Tar String 
$ph_tar = "cfg/photos_" . $id_hex . ".tar.gz";
$ph_url = "http://labs.justabitmatt.com/frame/" . $ph_tar;

//Photo Time String (TODO: MAKE CONFIGURABLE)
$ph_tim = "00000010";

//Generate Frame Config Text and save to file
$frm_cfg = '<ID>'        . $id_hex . '</ID>'        . "\n" .
           '<PHOTOTIME>' . $ph_tim . '</PHOTOTIME>' . "\n" .
           '<PHOTOTAR>'  . $ph_url . '</PHOTOTAR>'  . "\n";

file_put_contents( "cfg/tmp/tmp.cfg" , $frm_cfg );

//////////////////////////////////////////////
//
// FINALIZATION
//
//////////////////////////////////////////////

$files = glob('cfg/photos_*'); // get all file names
foreach($files as $file){ // iterate files
  if(is_file($file))
    unlink($file); // delete file
}

//Move New Config
rename( "cfg/tmp/tmp.tar.gz", "cfg/photos_" . $id_hex . ".tar.gz" );
rename( "cfg/tmp/tmp.cfg"   , "cfg/frame.cfg" );

//Remove tmp area
rmdir_recursive('cfg/tmp');
?>
