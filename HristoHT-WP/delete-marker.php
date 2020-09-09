<?php
define( 'SHORTINIT', true );
require( '../../../wp-load.php' );

global $wpdb;
$table_name = $wpdb->prefix . "markers2";
$wpdb->delete($table_name, array('id' => $_POST['id']));

