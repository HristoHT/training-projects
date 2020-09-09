<?php
define( 'SHORTINIT', true );
echo ABSPATH . "\n";
require( '../../../wp-load.php' );
echo '1234';
global $wpdb;
$table_name = $wpdb->prefix . "markers2";
$results = $wpdb->get_results("SELECT * FROM $table_name");
echo '1234';
$response = json_encode(array("e" => false, "data" => [1,2,34]));

echo $response;