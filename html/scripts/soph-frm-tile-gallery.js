// Soph Frame Tile Gallery

function tileGallery( configObj, elementId ) {

  this.config = configObj;
  this.elementId = elementId;
  this.init = function () {
    htmlToIns = "";
    for( var i=0; i<this.config.length; i++) {

      imgId      = "tile-"+i+"-img";
      overId     = "tile-"+i+"-hide-over";
      overIconId = "tile-"+i+"-hide-over-icon";

      if( (i % 3) == 0 ) {
        htmlToIns += "<div class='row tile-row'>";
      }
      htmlToIns += "<div class='four columns tile-container'>" +
                   "  <img id='" + imgId + "' src='" + this.config[i]['photoPath'] + "' class='tile-img'>" +
                   "  <div id='" + overId + "' class='tile-hide-over'>" +
                   "    <i id='" + overIconId + "' class='fa fa-eye-slash'></i>" +
                   "  </div>" +
                   "</div>";
      if( ((i+1) % 3) == 0) {
        htmlToIns += "</div>";
      }
    } 
    $('#' + this.elementId).append(htmlToIns);
 
  };
  return this;
} 
