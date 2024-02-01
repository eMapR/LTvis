<?php
// The message
//$message = "Hi, how are you doing? ". $argv[1]." ".$argv[2] ;
//['http://emapr.ceoas.oregonstate.edu/pages/data/viz/requests/000480/conus_land_cover_ARD_tile_h03v03.zip', 'http://emapr.ceoas.oregonstate.edu/pages/data/viz/requests/000480/conus_biomass_ARD_tile_h03v03.zip']
mail($argv[1], 'EmapR Data', $argv[2]);
//mail('clarype@oregonstate.edu', 'EmapR Data', 'hello here is the zip file http://emapr.ceoas.oregonstate.edu/pages/data/viz/requests/000697/conus_canopy_cover_ARD_tile_h04v01.zip');
?>
