<?php
	
	$cmd = "/usr/lib/anaconda3/bin/python ../py/dataRequest.py " . "'".json_encode($_POST)."'" . " >> /var/www/emapr/pages/data/viz_v2/logs/log.txt";
	exec($cmd, $out);
	//echo $cmd;
	//echo count($out);
	//echo $out;
	//for ($x = 0; $x < count($out); $x++) {	
	//	echo '<p>' . $out[$x] . "</p>";
	//}
?>
