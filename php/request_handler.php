<?php
	//#########################################################################################################
	// GET INPUTS
	//#########################################################################################################	

	// get the data requested
	//$lat = $_POST['lat'];
	//$lon = $_POST['lon'];
	//$dataPath = $_POST['dataPath'];
	//echo 'lat: ' . $lat . ', lon: ' . $lon . ', data: ' . $dataPath;

	//$lat = 44.36804189293885;
	//$lon = -123.41766357421876;
	//$dataPath = "/data/maps/WAORCA_biomass/crm/default.vrt";	
	
	//$cmd = '/home/clarype/miniconda3/envs/ltvis/bin/python ../py/getPixelTS.py ' . $dataPath . ' ' . $lon . ' ' . $lat;
	$cmd = '/opt/conda/bin/python /var/www/html/LTvis/py/getPixelTS.py 1 2 3 ';
	
	
	$test = exec($cmd, $val, $t);
	//echo $val[0]; //
        //echo json_encode($val[0]);
        echo $val[0];

	
?>

