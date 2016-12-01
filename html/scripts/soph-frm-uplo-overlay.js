var crop_max_width = ($(window).width()-40); //400
var crop_max_height = (crop_max_width / (4/3)); //300
var jcrop_api;
var canvas = $("#uplo_canvas")[0];
var context;
var image;

//                Cancel
//    |-------------|-----------|
//    V             V           V
// SM_FILE_SEL -> SM_CROP_SEL -> SM_CROP_PRV
//                    ^                |
//                    |________________|



var prefsize;

function loadImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      image = new Image();
      image.onload = startJcrop;
      image.src = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}

function dataURLtoBlob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = decodeURIComponent(parts[1]);

    return new Blob([raw], {
      type: contentType
    });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {
    type: contentType
  });
}

function startJcrop() {
  console.log("Initialising Crop...");
  if (jcrop_api != null) {
    jcrop_api.destroy();
  }
  context = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);    //Draw Image Without Crop
  $("#uplo_canvas").Jcrop({
    onSelect: selectcanvas,
    allowSelect: false,
    boxWidth: crop_max_width,
    boxHeight: crop_max_height,
    setSelect:   [ 50, 50, 1000, 1000 ],
    aspectRatio: 4 / 3
  }, function() {
    jcrop_api = this;
  });
  image.src = canvas.toDataURL('image/png');
  image.onload = null;
  state = "SM_CROP_SEL";
  stateChange();
}

function selectcanvas(coords) {
  prefsize = {
    x: Math.round(coords.x),
    y: Math.round(coords.y),
    w: Math.round(coords.w),
    h: Math.round(coords.h)
  };
}

function applyCrop() {
  canvas.width = prefsize.w;
  canvas.height = prefsize.h;
  context.drawImage(image, prefsize.x, prefsize.y, prefsize.w, prefsize.h, 0, 0, canvas.width, canvas.height);
  if (jcrop_api != null) {
    jcrop_api.disable();
    jcrop_api.release();
  }
  //validateImage();
}

function resizeAndPost() {
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
    url: "upload_img.php",
    data: { text: "test", img: encodeURIComponent(sc_dat) },
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    cache: false,
    success: function(data) {
      console.log(data);
      alert("Success");
    },
    error: function(data) {
      alert("Error");
    },
    complete: function(data) {}
  });
}

function submitCrop(e) {
  e.preventDefault();
  var dat = canvas.toDataURL('image/png');
  var sc_img = new Image;
  sc_img.onload = resizeAndPost;
  sc_img.src = dat;
  close_uplo();
};

function stateChange() {
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
}

$("#btn-uplo-next").click(function(e) {
  if( state == "SM_CROP_SEL") {
    console.log("Apply Crop Selection");
    applyCrop();
    state = "SM_CROP_PRV";
    stateChange();
  } else if ( state == "SM_CROP_PRV") {
    console.log("Submit Crop Selection");
    submitCrop(e);
    state = "SM_FILE_SEL";
    stateChange();
  } else {
  } 
});

$("#btn-uplo-back").click(function(e) {
  if( state == "SM_CROP_SEL") {
    console.log("Back to File Selection");
    stateChange();
  } else if ( state == "SM_CROP_PRV") {
    console.log("Back To Crop Selection");
    //image.src = origImg = canvas.toDataURL('image/png');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);    //Draw Image Without Crop
    jcrop_api.enable();
    jcrop_api.setSelect( [ prefsize.x, prefsize.y, (prefsize.x+prefsize.w), (prefsize.y+prefsize.h)] );
    state = "SM_CROP_SEL";
    stateChange();
  } else {
  } 
});

$("#file").change(function() {
  loadImage(this);
});

$( "#uplo_canvas" ).click(function() {
  $( "#file" ).trigger( "click" );
 });

function open_uplo(){
  $('.uplo-overlay').fadeIn(400);
}

function close_uplo(){
  $('.uplo-overlay').fadeOut(400);
  state = "SM_FILE_SEL";
  stateChange();
}

$('#header-uplo-icon').click(function(){
  open_uplo( );
});

var state = "SM_FILE_SEL";
stateChange();
