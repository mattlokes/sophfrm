<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$galleryDir         = getcwd() . '/gallery';
$galleryConfigPath  = $galleryDir . '/gallery.json';
$config             = json_decode(file_get_contents($galleryConfigPath), true);

//print($config[0]['photoPath']);

#Basic Auth to Restrict Access to Frame Configuration
if (!isset($_SERVER['PHP_AUTH_USER'])) :
    header('WWW-Authenticate: Basic realm="My Realm"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'You Must Enter a User Name & Password!';
    exit;
elseif( ($_SERVER['PHP_AUTH_USER'] == 'sophie') && 
          ($_SERVER['PHP_AUTH_PW'] == 'cookie')      ) : ?>

<!DOCTYPE html>
<html lang="en">
<head>

  <!-- Basic Page Needs
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta charset="utf-8">
  <title>Soph Frame</title>
  <meta name="description" content="">
  <meta name="author" content="">

  <!-- Mobile Specific Metas
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- FONT
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link href="//fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css">

  <!-- CSS
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/skeleton.css">
  <link rel="stylesheet" href="css/soph-frm.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">      

  <!-- Favicon
  –––––––––––––––––––––––––––––––––––––––––––––––––– 
  <link rel="icon" type="image/png" href="images/favicon.png"> -->

</head>
<body>

  <!-- Primary Page Layout
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
<div class='layout'>

  <!-- Floating Header -->
  <div class="header">
    <div class="container">
        <div class="header-icon-bar">
          <i class="fa fa-check fa-3x u-pull-right header-icon"></i>
          <i class="fa fa-clock-o fa-3x u-pull-right header-icon"></i>
          <i class="fa fa-upload fa-3x u-pull-right header-icon"></i>
        </div>
    </div>
  </div>
   
  
  <!-- Gallery Generated -->
  <div class="content">
    <div class="container">
      <?php
        for ($x = 0; $x < sizeof($config); $x++) {
          if( ($x % 3) == 0) {
            echo "<div class='row tile-row'>\n";
          }
         echo "<div class='four columns'>" . 
              "  <img id='tile_" . $x . "' src='" . $config[$x]['photoPath'] . "' class='tile-img'>" . 
              "</div>\n";
          if( (($x+1) % 3) == 0) {
            echo "</div>\n";
          }
        } 
      ?>
    </div>
  </div>
  
  <!-- Img Overlay -->
  <div class="tile-overlay">

    <!-- Overlay content -->
    <div class="tile-overlay-content">
      <div class='container'>
        <div class='row'>
          <div class='four columns mob-port-hack'>&nbsp</div>
          <div class='four columns'>
            <img src='' id='tile-overlay-preview' class='tile-overlay-img'>
            <div id='tile-overlay-hidden' class="tile-hidden">
              <i id='tile-overlay-hidden-icon' class="fa fa-eye-slash"></i>
            </div>
          </div>
          <div class='four columns'>&nbsp</div>
        </div>
      </div>
      <div>
        <button type="button" id='btn-tile-hide'>
          <i class="fa fa-eye fa-lg tile-overlay-btn-icon"></i>Hide
        </button>
      </div>
      <div>
        <button type="button" id='btn-tile-delete'>
          <i class="fa fa-trash fa-lg tile-overlay-btn-icon"></i>Delete
        </button>
      </div>
    </div>

  </div>
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script type="text/javascript"> 
    var global_galleryConfig = <?php echo file_get_contents($galleryConfigPath) ?>;
  </script>
  <script src="scripts/soph-frm-tile-overlay.js"></script>

</div>
<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>

<?php endif; ?>