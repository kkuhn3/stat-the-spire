<?php 
$out = array();
foreach (glob('runs/**/*.run') as $filename) {
    $out[] = $filename;;
}
echo json_encode($out); 
?>;