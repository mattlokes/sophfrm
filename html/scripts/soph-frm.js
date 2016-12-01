tiles = new tileGallery( global_galleryConfig, "tile_gallery");
tiles.init();

tileSelect = new tileOverlay( global_galleryConfig, "tile_overlay");
tileSelect.init();
$('.tile-img').click(function(){
  tileSelect.open( this ); 
});
    
$('.tile-hide-over-g').click(function(){
  tileSelect.open( $(this).siblings('img') );
});
    

$(window).on('resize', function(){
  tiles.resize();
  tileSelect.resize();
});
