<?php
define( 'SHORTINIT', true );
require( '../../../wp-load.php' );

global $wpdb;
$table_name = $wpdb->prefix . "markers2";

//$entityBody = file_get_contents("php://input");
$data = json_decode(file_get_contents('php://input'), true);
$response = json_encode(array("e" => $data['features'][0]['properties']['place']));
//echo $response;

$insertArr = array();

foreach($data['features'] as $qauke){
    $time = $qauke['properties']['time'];
    $mag = $qauke['properties']['mag'];
    $place = $qauke['properties']['place'];
    $lon = $qauke['geometry']['coordinates'][0]; 
    $lat = $qauke['geometry']['coordinates'][1]; 
    $insertArr[] = $wpdb->prepare( "(%d,%d,%s,%d,%d)", $lon, $lat,$place, $mag, $time );
}

$query = "INSERT INTO $table_name (lon, lat, place, mag, tm) VALUES ";
$query .= implode( ",\n", $insertArr );
$wpdb->query("TRUNCATE TABLE $table_name");
$wpdb->query($query);

$response = json_encode(array("e" => $insertArr));
echo $response;


