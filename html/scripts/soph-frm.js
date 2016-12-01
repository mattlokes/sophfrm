tiles = tileGallery( global_galleryConfig, "tile_gallery");
tiles.init();

$(window).on('resize', function(){
  tiles.resize();
  resize_tile_overlay_preview(global_img_obj);
});
