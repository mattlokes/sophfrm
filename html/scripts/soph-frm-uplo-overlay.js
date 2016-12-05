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
  this.cropMaxWidth  = 400;
  this.cropMaxHeight = 300;
  this.cropIsPortrait = false;

  this.init = function () {
    this.stateChange("SM_FILE_SEL");

    $("#btn-uplo-next").click(function(e) {
      if( g_uo.state == "SM_CROP_SEL") {
        console.log("Apply Crop Selection");
        g_uo.applyCrop();
        g_uo.stateChange("SM_CROP_PRV");
      } else if ( g_uo.state == "SM_CROP_PRV") {
        console.log("Submit Crop Selection");
        g_uo.submitCrop(e);
        g_uo.stateChange("SM_FILE_SEL");
      }
    });
    
    $("#btn-uplo-back").click(function(e) {
      if( g_uo.state == "SM_CROP_SEL") {
        console.log("Back to File Selection");
        g_uo.close();
        g_uo.stateChange("SM_FILE_SEL");
      } else if ( g_uo.state == "SM_CROP_PRV") {
        console.log("Back To Crop Selection");
        //image.src = origImg = canvas.toDataURL('image/png');
        g_uo.startCropTool(g_uo.imageObj, g_uo.cropIsPortrait, false);
        //context.drawImage(image, 0, 0, canvas.width, canvas.height);    //Draw Image Without Crop
        //jcrop_api.enable();
        //jcrop_api.setSelect( [ prefsize.x, prefsize.y, (prefsize.x+prefsize.w), (prefsize.y+prefsize.h)] );
        g_uo.stateChange("SM_CROP_SEL");
      } else {
      } 
    });
    
    $("#file").change(function() {
      g_uo.loadImg(this);
    });
    
    $('#header-uplo-icon').click(function(){
      g_uo.open( );
    });


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
    g_uo.startCropTool( g_uo.imageObj, isPort, false );  
    g_uo.imageObj.onload = null;
  };


  this.startCropTool = function( img, isPort, isCrop ) {
    console.log("Initialising Crop...");
    if (g_uo.jcropApi != null) {
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
    
    if( isCrop ) {
      g_uo.canvasDom.width = maxW;
      g_uo.canvasDom.height = maxW/(4/3);
      g_uo.canvasCtxt.drawImage(img, g_uo.cropSel.x, 
                                     g_uo.cropSel.y, 
                                     g_uo.cropSel.w, 
                                     g_uo.cropSel.h, 
                                     0, 0, 
                                     maxW, (maxW/(4/3)) );
      g_uo.stateChange("SM_CROP_PRV");
    } else {
      g_uo.canvasDom.width = img.width;
      g_uo.canvasDom.height = img.height;
      g_uo.canvasCtxt.drawImage( img, 0, 0);    //Draw Image Without Crop
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
    //image.src = canvas.toDataURL('image/png');
  };

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
    g_uo.startCropTool( g_uo.imageObj, false, true );
    if (g_uo.jcropApi != null) {
      g_uo.jcropApi.disable();
      g_uo.jcropApi.release();
    };
  };

  this.stateChange = function( state ) {
    if ( state == "SM_FILE_SEL" ) {
       $("#btn-uplo-next").css('display', 'none');
       $("#btn-uplo-back").css('display', 'none');
    } else if( state == "SM_CROP_SEL") {
       $("#btn-uplo-next").html('Crop');
       $("#btn-uplo-back").html('Back');
       $("#btn-uplo-next").css('display', 'inline');
       $("#btn-uplo-back").css('display', 'inline');
    } else if ( state == "SM_CROP_PRV") {
       $("#btn-uplo-next").html('Submit');
       $("#btn-uplo-back").html('Back');
       $("#btn-uplo-next").css('display', 'inline');
       $("#btn-uplo-back").css('display', 'inline');
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
        //console.log(data);
        alert("Success");
      },
      error: function(data) {
        alert("Error");
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
    g_uo.close();
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

  g_uo = this;
  return this;
}

