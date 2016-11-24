    
    var global_cfgIdx  = 0;
    var global_cfgShow = true;
    var global_img_obj = null;

    function save_cfg_changes () {
      $.ajax({
               type: "POST",
               dataType: "json",
               url: "gallery_cfg_save.php",
               data: JSON.stringify(global_galleryConfig),
               contentType: "application/json"
             });    

    }

    function resize_tile_overlay_preview( img_obj ) {
      var obj_h    = parseFloat( $( img_obj ).css('height') ); 
      var obj_w    = parseFloat( $( img_obj ).css('width') );
      
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
    }

    function open_tile_overlay ( e ) {
      var img_src  = $( e ).attr('src'); 
      global_img_obj = e;
      global_cfgIdx  = parseInt( $( e ).attr('id').replace('tile-', '').replace('-img', '') );
      global_cfgShow = global_galleryConfig[global_cfgIdx]['show'];

      // -------------------------------------------
      // Configure tile-overlay preview image
      // -------------------------------------------- 
      $('#tile-overlay-img').attr('src', img_src);
      resize_tile_overlay_preview( e ); //Resize Image and Disabled Layer

      // -------------------------------------------
      // Configure tile-overlay Show button
      // --------------------------------------------
      if ( global_cfgShow ) {
        $('#tile-overlay-hide-over').css('display','none');                                            //Hide Eye-slash overlay
        $('#btn-tile-hide').html("<i class='fa fa-eye-slash fa-lg tile-overlay-btn-icon'></i>Hide");//Button becomes Hide
      } else {
        $('#tile-overlay-hide-over').css('display','block');                                           //Show Eye-slash overlay
        $('#btn-tile-hide').html("<i class='fa fa-eye fa-lg tile-overlay-btn-icon'></i>Show");      //Button becomes show
      } 
      
      // -------------------------------------------- 
      // Open overlay
      // -------------------------------------------- 
      $('.tile-overlay').fadeIn(400);
    }
    
   function close_tile_overlay ( ) {
      $('.tile-overlay').fadeOut(400);
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
    
    $('.tile-hide-over-g').click(function(){
      open_tile_overlay( $(this).siblings('img') );
    });
    
    $('#btn-tile-hide').click(function(){
      if(global_cfgShow) { //If Img show, hide img on click, show overlay
        $('#tile-'+global_cfgIdx+'-hide-over').fadeIn(400);  //Show Eye-slash overlay
      } else { //Img was hidden, now show on click, show overlay
        $('#tile-'+global_cfgIdx+'-hide-over').fadeOut(400);  //Hide Eye-slash overlay
      }
      global_galleryConfig[global_cfgIdx]['show'] = !global_cfgShow;
      save_cfg_changes();
    });
