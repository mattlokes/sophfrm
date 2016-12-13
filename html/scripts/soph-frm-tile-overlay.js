// Soph Frame Tile Overlay
var global_tileOverlay = null;

function tileOverlay (configObj, elementId) {

  this.config    = configObj;
  this.elementId = elementId;
  this.tileIdx   = null;
  this.tileImg   = null;
  this.tileShow  = true;
  this.init= function() {

    //Set Hide Overlay Selection click Handler 
    $('#btn-tile-hide').click(function(){
      if(global_tileOverlay.tileShow) { //If Img show, hide img on click, show overlay
        $('#tile-'+global_tileOverlay.tileIdx+'-hide-over').fadeIn(400);  //Show Eye-slash overlay
      } else { //Img was hidden, now show on click, show overlay
        $('#tile-'+global_tileOverlay.tileIdx+'-hide-over').fadeOut(400);  //Hide Eye-slash overlay
      }
      global_tileOverlay.config[global_tileOverlay.tileIdx]['show'] = !global_tileOverlay.tileShow;
      global_tileOverlay.saveCfg();
    });
    
    //Set Delete Overlay Selection click Handler 
    $('#btn-tile-delete').click(function(){
      if( global_tileOverlay.config.length == 1) {
        alert("Sorry cant let you delete the last photo!");
      } else {
        if( confirm("Are you sure?") ) {
          g_uo.spinnerOpen();
          $.ajax({
           type: "POST",
           url: "img_delete.php",
           data: { delList : [ global_tileOverlay.config[global_tileOverlay.tileIdx]['photoPath'],
                               global_tileOverlay.config[global_tileOverlay.tileIdx]['procPhotoPath']  ]},
           //contentType: "application/x-www-form-urlencoded;charset=UTF-8",
           cache: false,
           success: function(data) {
             console.log(data);
             global_tileOverlay.config.splice(global_tileOverlay.tileIdx, 1 ); //Delete Item
             global_tileOverlay.saveCfg();

             //Gallery Update
             global_tileGallery.update();

             g_uo.spinnerClose();
           },
           error: function(data) {
             alert("Error: Contact your local Matt Representative [POST-DELETE]");
           },
           complete: function(data) {}
          });
        }
      }
    });

   
   
    //Set Close Overlay click Handler 
    $('.tile-overlay').click(function(){
      global_tileOverlay.close(); 
    });
  };
  
  this.saveCfg = function() {
      $.ajax({
               type: "POST",
               dataType: "json",
               url: "gallery_cfg_save.php",
               data: JSON.stringify(this.config),
               contentType: "application/json"
             });    
  };

  this.open = function( imgObj ) { 
    var img_src  = $( imgObj ).attr('src'); 
    this.tileImg = imgObj;
    this.tileIdx  = parseInt( $( imgObj ).attr('id').replace('tile-', '').replace('-img', '') );
    this.tileShow = this.config[this.tileIdx]['show'];

    // Configure tile-overlay preview image
    $('#tile-overlay-img').attr('src', img_src);
    this.resize( this.tileImg ); //Resize Image and Disabled Layer

    // Configure tile-overlay Show button
    if ( this.tileShow ) {
      $('#tile-overlay-hide-over').css('display','none');                                            //Hide Eye-slash overlay
      $('#btn-tile-hide').html("<i class='fa fa-eye-slash fa-lg tile-overlay-btn-icon'></i>Hide");//Button becomes Hide
    } else {
      $('#tile-overlay-hide-over').css('display','block');                                           //Show Eye-slash overlay
      $('#btn-tile-hide').html("<i class='fa fa-eye fa-lg tile-overlay-btn-icon'></i>Show");      //Button becomes show
    } 
    
    // Open overlay
    $('.tile-overlay').fadeIn(400);
  };
  
  this.close = function() {
    $('.tile-overlay').fadeOut(400);
  };

  this.resize = function() {
    //If no tileImg Bail
    if (this.tileImg == null) { console.log("Resize Overlay and never been opened"); return; }
   
    var obj_h    = parseFloat( $( this.tileImg ).css('height') ); 
    var obj_w    = parseFloat( $( this.tileImg ).css('width') );
    
    // Scale tile-overlay IMG
    if (window.matchMedia('(min-width: 550px)').matches) { 
      //obj_h = obj_h *i 1.25;
      //obj_w = obj_w * 2;
    }

    $('#tile-overlay-img').css('width', obj_w+"px");
    $('#tile-overlay-img').css('height', obj_h+"px");
    //Hidden Layer
    $('#tile-overlay-hide-over').css('width', obj_w+"px");
    $('#tile-overlay-hide-over').css('height', obj_h+"px");
    $('#tile-overlay-hide-over-icon').css('font-size',   (obj_w * 0.66)+"px");
    $('#tile-overlay-hide-over-icon').css('padding-top', (  (obj_h - (obj_w * 0.66) ) * 0.5 )+"px");
  }; 

  global_tileOverlay = this;
  return this;
}
