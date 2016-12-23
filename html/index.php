<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
include 'config.php';

$galleryDir         = getcwd() . '/gallery';
$galleryConfigPath  = $galleryDir . '/gallery.json';

#Basic Auth to Restrict Access to Frame Configuration
if (!isset($_SERVER['PHP_AUTH_USER'])) :
    header('WWW-Authenticate: Basic realm="sophframemain"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'You Must Enter a User Name & Password!';
    exit;
elseif( check_user( $_SERVER['PHP_AUTH_USER'] , $_SERVER['PHP_AUTH_PW'] )) : ?>

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
  <link rel="stylesheet" href="css/soph-frm-uplo-overlay.css">
  <link rel="stylesheet" href="css/soph-frm-tile-overlay.css">
  <link rel="stylesheet" href="css/soph-frm-tile-gallery.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">      
  <link rel="stylesheet" href="css/jquery.Jcrop.min.css">

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
          <i class="fa fa-gears fa-3x u-pull-right header-icon"></i>
          <i id="header-uplo-icon" class="fa fa-plus fa-3x u-pull-right header-icon"></i>
        </div>
    </div>
  </div>
   
  
  <!-- Gallery Generated -->
  <div class="content">
    <div id='tile_gallery' class="container">
    </div>
  </div>
  
  <!-- Img Overlay -->
  <div class="tile-overlay">

    <!-- Overlay content -->
    <div class="tile-overlay-content">
      <div class='container'>
        <div class='row'>
          <div class='four columns mob-port-hack'>&nbsp</div>
          <div class='four columns tile-container'>
            <img src='' id='tile-overlay-img' class='tile-overlay-img'>
            <div id='tile-overlay-hide-over' class="tile-hide-over">
              <i id='tile-overlay-hide-over-icon' class="fa fa-eye-slash"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Overlay Footer -->
    <div class="tile-overlay-footer">
      <div class="container">
          <div class="tile-overlay-footer-il">
            <i id='btn-tile-hide' class="fa fa-eye fa-3x u-pull-left header-icon"></i>
          </div>
          <div class="tile-overlay-footer-ic">
          </div>
          <div class="tile-overlay-footer-ir">
            <i id='btn-tile-delete' class="fa fa-trash fa-3x u-pull-right header-icon"></i>
          </div>

      </div>
    </div>


  </div>

  <!-- Uplo Overlay -->
  <div class="uplo-overlay">

    <!-- Overlay content -->
    <div class="uplo-overlay-content">
      <input id="file" type="file" style="display: none" />
      <div class='container uplo-canvas-cont'>
        <div class='row'>
          <div id='ins-crop-canvas' class='tweleve columns uplo-container'>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay Footer -->
    <div class="uplo-overlay-footer">
      <div class="container">
          <div class="uplo-overlay-footer-il">
            <i id='btn-uplo-left' class="fa fa-arrow-left fa-3x u-pull-left header-icon"></i>
          </div>
          <div class="uplo-overlay-footer-ic">
            <i id='btn-uplo-cent' class="fa fa-rotate-right fa-3x header-icon"></i>
          </div>
          <div class="uplo-overlay-footer-ir">
            <i id='btn-uplo-right' class="fa fa-crop fa-3x u-pull-right header-icon"></i>
          </div>
      </div>
    </div>

  </div>
  
  <!-- Uplo Overlay Spinner -->
  <div class="uplo-overlay-spinner">
    <div class= "spinner-cont">
      <div class="spinner">Loading...</div>
      <div class="spinner-text"> Magic in process, please wait... </div>
    </div>
  </div>
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="scripts/jquery.Jcrop.min.js"></script>
  <script type="text/javascript">
    $.expr.cacheLength = 1; 
    var global_galleryConfig = <?php echo file_get_contents($galleryConfigPath) ?>;
  </script>
  <script src="scripts/soph-frm-tile-gallery.js"></script>
  <script src="scripts/soph-frm-tile-overlay.js"></script>
  <script src="scripts/soph-frm-uplo-overlay.js"></script>
  <script src="scripts/soph-frm.js"></script>

</div>
<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>

<?php 
else:
    echo 'Invalid Password!';
    header('WWW-Authenticate: Basic realm="sophframemain"');
    header('HTTP/1.0 401 Unauthorized');
endif; ?>
