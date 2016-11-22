// Soph Frame Tile Gallery

function tileGallery( configObj, elementId ) {

  this.config = configObj;
  this.elementId = elementId;
  this.init = function () {
    htmlToIns = "";
    for( var i=0; i<this.config.length; i++) {
      if( (i % 3) == 0 ) {
        htmlToIns += "<div class='row tile-row'>";
      }
      htmlToIns += "<div class='four columns'>" +
                   "  <img id='tile_" + i + "' src='" + this.config[i]['photoPath'] + "' class='tile-img'>" +
                   "</div>";
      if( ((i+1) % 3) == 0) {
        htmlToIns += "</div>";
      }
    } 
    $('#' + this.elementId).append(htmlToIns);
 
  };
  return this;
} 
