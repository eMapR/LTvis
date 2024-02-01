<?php
	//#########################################################################################################
	// GET INPUTS
	//#########################################################################################################	

	// get the data requested
	$lat = $_POST['lat'];
	$lon = $_POST['lon'];
	$dataPath = $_POST['dataPath'];
	//echo 'lat: ' . $lat . ', lon: ' . $lon . ', data: ' . $dataPath;

	//$lat = 44.36804189293885;
	//$lon = -123.41766357421876;
	//$dataPath = "/data/maps/WAORCA_biomass/crm/default.vrt";	
	
	$cmd = '/usr/lib/anaconda3/bin/python ../py/getPixelTS.py ' . $dataPath . ' ' . $lon . ' ' . $lat;
	
	
	$test = exec($cmd, $val, $t);
	echo $val[0]; //json_encode($output);

	
?>

