// Soph Frame Tile Gallery

function tileGallery( configObj, elementId ) {

  this.config    = configObj;
  this.elementId = elementId;
  this.tileNum   = this.config.length
  this.init = function () {
    //Insert HTML
    htmlToIns = "";
    for( var i=0; i<this.tileNum; i++) {

      imgId      = "tile-"+i+"-img";
      overId     = "tile-"+i+"-hide-over";
      overIconId = "tile-"+i+"-hide-over-icon";

      if( (i % 3) == 0 ) {
        htmlToIns += "<div class='row tile-row'>";
      }
      htmlToIns += "<div class='four columns tile-container'>" +
                   "  <img id='" + imgId + "' src='" + this.config[i]['photoPath'] + "' class='tile-img'>" +
                   "  <div id='" + overId + "' class='tile-hide-over-g'>" +
                   "    <i id='" + overIconId + "' class='fa fa-eye-slash'></i>" +
                   "  </div>" +
                   "</div>";
      if( ((i+1) % 3) == 0) {
        htmlToIns += "</div>";
      }
    } 
    $('#' + this.elementId).append(htmlToIns);
   

   setTimeout(function(){
     var obj_h    = parseFloat( $( '#tile-0-img' ).css('height') );
     var obj_w    = parseFloat( $( '#tile-0-img' ).css('width') );
 
     //Alter tile-#-hide-over-icon padding and size;
     for( var i=0; i<this.tileNum; i++) {
       overIconId = "tile-"+i+"-hide-over-icon";
       overId     = "tile-"+i+"-hide-over";
       //$('#tile-overlay-hide-over').css('width', obj_w+"px");
       $('#' + overId).css('height', obj_h+"px");
       $('#' + overIconId).css('font-size',   (obj_w * 0.66)+"px");
       $('#' + overIconId).css('padding-top', (  (obj_h - (obj_w * 0.66) ) * 0.5 )+"px");
       if ( !this.config[i]['show']) {
         $('#' + overId ).css('display','block');
       }
     }
    },50); 

  };
  return this;
}

 
