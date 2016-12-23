// Soph Frame Upload Overlay
var g_uo = null;
//var crop_max_width = $(window).width(); //400
//var crop_max_height = (crop_max_width / (4/3)); //300

function uploadOverlay ( configObj, elementId ) {

  this.cropToolState = "SM_FILE_SEL";
  this.config     = configObj;
  this.elementId  = elementId;
  this.jcropApi   = null;
  this.canvasDom  = null;
  this.canvasCtxt = null;
  this.imageObj   = null;
  this.cropSel    = null;
  this.cropIsPortrait = false;
  this.angle      = 0;
  this.offscreenAngle = 360;
  this.offscreenCanvas = document.createElement('canvas');
  this.offscreenCtx    = this.offscreenCanvas.getContext('2d');

  this.init = function () {
    this.stateChange("SM_FILE_SEL");

    $("#btn-uplo-right").click(function(e) {
      if( g_uo.state == "SM_CROP_SEL") {
        g_uo.applyCrop();
        g_uo.stateChange("SM_CROP_PRV");
      } else if ( g_uo.state == "SM_CROP_PRV") {
        g_uo.spinnerOpen();
        g_uo.submitCrop(e);
        g_uo.stateChange("SM_FILE_SEL");
      }
    });
    
    $("#btn-uplo-left").click(function(e) {
      if( g_uo.state == "SM_FILE_SEL") {
        g_uo.close();
        g_uo.stateChange("SM_FILE_SEL");
      } else if( g_uo.state == "SM_CROP_SEL") {
        g_uo.close();
        g_uo.stateChange("SM_FILE_SEL");
      } else if ( g_uo.state == "SM_CROP_PRV") {
        g_uo.startCropTool(g_uo.imageObj, g_uo.cropIsPortrait, false, g_uo.angle);
        g_uo.stateChange("SM_CROP_SEL");
      } else {
      } 
    });
    
    $("#btn-uplo-cent").click(function(e) {
      g_uo.angleInc(90);
      g_uo.cropIsPortrait = !g_uo.cropIsPortrait; 
      g_uo.startCropTool(g_uo.imageObj, g_uo.cropIsPortrait, false, g_uo.angle);
    });
    
    $("#file").change(function() {
      g_uo.loadImg(this);
      $("#file").val('');
    });
    
    $('#header-uplo-icon').click(function(){
      g_uo.open( );
    });
    
  };

  this.angleInc = function ( inc ) {
    g_uo.angle += inc;
    if ( g_uo.angle >= 360 ) { g_uo.angle -=360; }
  };
  
  this.angleDec = function ( dec ) {
    g_uo.angle -= dec;
    if ( g_uo.angle < 0 ) { g_uo.angle +=360; }
  };


  //                Cancel
  //    |-------------|-----------|
  //    V             V           V
  // SM_FILE_SEL -> SM_CROP_SEL -> SM_CROP_PRV
  //                    ^                |
  //                    |________________|

  this.loadImg = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        g_uo.imageObj = new Image();
        g_uo.imageObj.onload = g_uo.imgLoaded;
        g_uo.imageObj.src = e.target.result;
      }
      reader.readAsDataURL(input.files[0]);
    }
  };

  this.imgLoaded = function () {
    var isPort = false
    g_uo.cropIsPortrait = false;
    if( g_uo.imageObj.height > g_uo.imageObj.width ) { //Portrait
      isPort = true;
      g_uo.cropIsPortrait = true;
    }
    g_uo.startCropTool( g_uo.imageObj, isPort, false, 0 );  
    g_uo.imageObj.onload = null;
  };


  this.startCropTool = function( img, isPort, isCrop, angle ) {
    if (g_uo.jcropApi != null) {
      $(document).unbind('touchstart.jcrop-ios');
      g_uo.jcropApi.destroy();
    }
    $('#ins-crop-canvas').prepend('<canvas id="uplo_canvas" class="uplo-canvas"></canvas>');
    g_uo.canvasDom  = $("#uplo_canvas")[0];
    g_uo.canvasCtxt = g_uo.canvasDom.getContext("2d");
    

    if( isPort ) {
      var maxH = $(window).height() * 0.66;
      //var maxW = $(window).width();
      var maxW = parseFloat($('#ins-crop-canvas').css('width').replace('px',''));
    } else {
      var maxH = $(window).height();
      //var maxW = $(window).width();
      var maxW = parseFloat($('#ins-crop-canvas').css('width').replace('px',''));
    }

    if( angle != g_uo.offscreenAngle ){
      g_uo.rotateImg(angle);
    }
    
    if( isCrop ) {
      g_uo.canvasDom.width = g_uo.cropSel.w;
      g_uo.canvasDom.height = g_uo.cropSel.h;
      g_uo.canvasCtxt.drawImage(g_uo.offscreenCanvas, g_uo.cropSel.x, 
                                     g_uo.cropSel.y, 
                                     g_uo.cropSel.w, 
                                     g_uo.cropSel.h, 
                                     0, 0, 
                                     g_uo.cropSel.w,
                                     g_uo.cropSel.h );
      g_uo.stateChange("SM_CROP_PRV");
    } else {
      g_uo.canvasDom.width = g_uo.offscreenCanvas.width;
      g_uo.canvasDom.height = g_uo.offscreenCanvas.height;
      g_uo.canvasCtxt.drawImage( g_uo.offscreenCanvas, 0, 0);    //Draw Image Without Crop
      g_uo.stateChange("SM_CROP_SEL");
    }

    $("#uplo_canvas").Jcrop({
      onSelect: g_uo.selectCropEvent,
      allowSelect: false,
      boxWidth: maxW,
      boxHeight: maxH,
      setSelect:   [ 50, 50, 1000, 1000 ],
      aspectRatio: 4 / 3
    }, function() {
      g_uo.jcropApi = this;
    });

    //g_uo.canvasDom.style.maxWidth = maxW+"px";
    //g_uo.canvasDom.style.maxHeight = maxH+"px";
  };


  this.rotateImg = function( angle ) {

    var size = Math.max(g_uo.imageObj.width, g_uo.imageObj.height);

    g_uo.offscreenCtx.save();

    if( angle == 0 || angle == 360 ){ 
      g_uo.offscreenCanvas.width = g_uo.imageObj.width;
      g_uo.offscreenCanvas.height = g_uo.imageObj.height;
      g_uo.offscreenCtx.drawImage( g_uo.imageObj,0,0 );
    } else if (angle == 90 ){
      g_uo.offscreenCanvas.width = g_uo.imageObj.height;
      g_uo.offscreenCanvas.height = g_uo.imageObj.width;;
      g_uo.offscreenCtx.rotate(angle * Math.PI/180);
      g_uo.offscreenCtx.drawImage( g_uo.imageObj,0, -g_uo.imageObj.height );
    } else if (angle == 180){
      g_uo.offscreenCanvas.width = g_uo.imageObj.width;
      g_uo.offscreenCanvas.height = g_uo.imageObj.height;
      g_uo.offscreenCtx.rotate(angle * Math.PI/180);
      g_uo.offscreenCtx.drawImage( g_uo.imageObj,-g_uo.imageObj.width, -g_uo.imageObj.height );
    } else if (angle == 270){
      g_uo.offscreenCanvas.width = g_uo.imageObj.height;
      g_uo.offscreenCanvas.height = g_uo.imageObj.width;;
      g_uo.offscreenCtx.rotate(angle * Math.PI/180);
      g_uo.offscreenCtx.drawImage( g_uo.imageObj,-g_uo.imageObj.width, 0 );
    } else {
      console.error("Only multipleis of 90Deg Angle Supported [" + angle + "]");
    }
    
    g_uo.angle = angle;
    g_uo.offscreenCtx.restore();
  }

  this.selectCropEvent = function(coords) {
    g_uo.cropSel = {
      x: Math.round(coords.x),
      y: Math.round(coords.y),
      w: Math.round(coords.w),
      h: Math.round(coords.h)
    };
  };

  this.applyCrop = function () {
  
    //canvas.width = prefsize.w;
    //canvas.height = prefsize.h;
    g_uo.startCropTool( g_uo.imageObj, false, true, g_uo.angle );
    if (g_uo.jcropApi != null) {
      g_uo.jcropApi.disable();
      g_uo.jcropApi.release();
    };
  };

  this.stateChange = function( state ) {
    if ( state == "SM_FILE_SEL" ) {
       $("#btn-uplo-left").css('display', 'inline'); //ALWAYS SHOW BACK
       $("#btn-uplo-cent").css('display', 'none');
       $("#btn-uplo-right").css('display', 'none');
    } else if( state == "SM_CROP_SEL") {
       $("#btn-uplo-right").removeClass("fa-check");
       $("#btn-uplo-right").addClass("fa-crop");
       $("#btn-uplo-right").css('display', 'inline');
       //$("#btn-uplo-left").css('display', 'inline'); //ALWAYS SHOW BACK
       $("#btn-uplo-cent").css('display', 'inline');
    } else if ( state == "SM_CROP_PRV") {
       $("#btn-uplo-right").removeClass("fa-crop");
       $("#btn-uplo-right").addClass("fa-check");
       $("#btn-uplo-right").css('display', 'inline');
       //$("#btn-uplo-left").css('display', 'inline'); //ALWAYS SHOW BACK
       $("#btn-uplo-cent").css('display', 'none');
    } else {
    } 
    g_uo.state = state;
  };

  this.resizeAndPost = function() {
     var sel_w = this.width;
     var sel_h = this.height;
     var tar_w = 0;
     var tar_h = 0;
  
     if(sel_w < 800) { // Scale Up (YUCK!)
       tar_w = 800;
       tar_h = 600;
     } 
     else if (sel_w > 1200) { // Scale Down
       tar_w = 1200;
       tar_h = 900;
     }
     else { // Keep Same Size
       tar_w = sel_w;
       tar_h = sel_h;
     }
  
     // create an off-screen canvas
     var sc_canvas = document.createElement('canvas'),
         sc_ctx = sc_canvas.getContext('2d');
  
     // set its dimension to target size
     sc_canvas.width = tar_w;
     sc_canvas.height = tar_h;
  
     // draw source image into the off-screen canvas:
     sc_ctx.drawImage(this, 0, 0, tar_w, tar_h);
  
     // encode image to data-uri with base64 version of compressed image
     var sc_dat = sc_canvas.toDataURL();
     $.ajax({
      type: "POST",
      url: "img_upload.php",
      data: { text: "test", img: encodeURIComponent(sc_dat) },
      contentType: "application/x-www-form-urlencoded;charset=UTF-8",
      cache: false,
      success: function(data) {
        g_uo.addCfg( data );
        global_tileOverlay.saveCfg()

        //Gallery Update
        global_tileGallery.update();

        g_uo.close();
        g_uo.spinnerClose();
      },
      error: function(data) {
        alert("Error: Contact your local Matt Representative [POST-UPLOAD]");
      },
      complete: function(data) {}
    });
  }
  
  this.submitCrop = function(e) {
    e.preventDefault();
    var dat = g_uo.canvasDom.toDataURL('image/png');
    var sc_img = new Image;
    sc_img.onload = g_uo.resizeAndPost;
    sc_img.src = dat;
  };

  this.addCfg = function(pth) {
    g_uo.config.unshift( { "photoPath":"gallery/preview/"+pth, 
                           "procPhotoPath":"gallery/processed/"+pth,
                           "show": true } 
                       );
  };

  this.open = function() {
    $('.uplo-overlay').fadeIn(400);
    $( "#file" ).trigger( "click" );
  };
  
  this.close = function(){
    $('.uplo-overlay').fadeOut(400);
    g_uo.stateChange("SM_FILE_SEL");
    if (g_uo.jcropApi != null) {
      g_uo.jcropApi.destroy();
    };
  };

  this.spinnerOpen = function() {
    $('.uplo-overlay-spinner').fadeIn(400);
  };
  
  this.spinnerClose = function() {
    $('.uplo-overlay-spinner').fadeOut(400);
  };


  g_uo = this;
  return this;
}

