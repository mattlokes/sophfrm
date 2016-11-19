    
    var global_cfgIdx  = 0;
    var global_cfgShow = true;
    var global_img_obj = null;

    function save_cfg_changes () {
    }

    function resize_tile_overlay_preview( img_obj ) {
      var obj_h    = parseFloat( $( img_obj ).css('height') ); 
      var obj_w    = parseFloat( $( img_obj ).css('width') );
      
      // Scale tile-overlay IMG
      if (window.matchMedia('(min-width: 550px)').matches) { 
        //img_h = img_h * 1.25;
        //img_w = img_w * 1.25;
      }

      $('#tile-overlay-preview').css('width', obj_w+"px");
      $('#tile-overlay-preview').css('height', obj_h+"px");
      //Hidden Layer
      $('#tile-overlay-hidden').css('left',$('#tile-overlay-preview').css('left'));         
      $('#tile-overlay-hidden').css('width', obj_w+"px");
      $('#tile-overlay-hidden').css('height', obj_h+"px");
      $('#tile-overlay-hidden-icon').css('font-size',   (obj_w * 0.66)+"px");
      $('#tile-overlay-hidden-icon').css('padding-top', (  (obj_h - (obj_w * 0.66) ) * 0.5 )+"px");
    }

    function open_tile_overlay ( e ) {
      var img_src  = $( e ).attr('src'); 
      global_img_obj = e;
      global_cfgIdx  = parseInt( $( e ).attr('id').replace('tile_', '') );
      global_cfgShow = global_galleryConfig[global_cfgIdx]['show'];

      // -------------------------------------------
      // Configure tile-overlay preview image
      // -------------------------------------------- 
      $('#tile-overlay-preview').attr('src', img_src);
      resize_tile_overlay_preview( e ); //Resize Image and Disabled Layer

      // -------------------------------------------
      // Configure tile-overlay Show button
      // --------------------------------------------
      if ( global_cfgShow ) {
        $('#tile-overlay-hidden').css('display','none');                                            //Hide Eye-slash overlay
        $('#btn-tile-hide').html("<i class='fa fa-eye-slash fa-lg tile-overlay-btn-icon'></i>Hide");//Button becomes Hide
      } else {
        $('#tile-overlay-hidden').css('display','block');                                           //Show Eye-slash overlay
        $('#btn-tile-hide').html("<i class='fa fa-eye fa-lg tile-overlay-btn-icon'></i>Show");      //Button becomes show
      } 
      
      // -------------------------------------------- 
      // Open overlay
      // -------------------------------------------- 
      $('.tile-overlay').fadeIn(400);
    }
    
   function close_tile_overlay ( ) {
      $('.tile-overlay').fadeOut(400);
      save_cfg_changes();
    }
   
    // ---------------------------------------
    // Event Handlers 
    // ---------------------------------------
    
    //Click Handler
    $('.tile-overlay').click(function(){
      close_tile_overlay( ); 
    });

    $('.tile-img').click(function(){
      open_tile_overlay( this ); 
    });
    
    $('#btn-tile-hide').click(function(){
      global_galleryConfig[global_cfgIdx]['show'] = !global_cfgShow;
    });
