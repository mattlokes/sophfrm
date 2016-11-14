<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$galleryDir            = getcwd() . '/gallery';
$galleryConfigPath    = $galleryDir . '/gallery.json';
$config = json_decode(file_get_contents($galleryConfigPath), true);

//print_r($config);

//print($config[0]['photoPath']);
?>

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

  <div class="header">
    <div class="container">
        <div class="header-icon">
          <i class="fa fa-save fa-3x u-pull-right white-icon-col"></i>
          <i class="fa fa-clock-o fa-3x u-pull-right white-icon-col"></i>
          <i class="fa fa-plus fa-3x u-pull-right white-icon-col"></i>
        </div>
    </div>
  </div>
   
  
  <div class="content">
    <div class="container">
      <?php
        for ($x = 0; $x < sizeof($config); $x++) {
          if( ($x % 3) == 0) {
            echo "<div class='row img-row'>\n";
          }
         echo "<div class='four columns'><img src='" . $config[$x]['photoPath'] . "' class='img-tile'></div>\n";
          if( (($x+1) % 3) == 0) {
            echo "</div>\n";
          }
        } 
      ?>
    </div>
  </div>

</div>
<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>
