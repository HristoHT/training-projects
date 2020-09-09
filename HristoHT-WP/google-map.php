<?php
/**
 * @package HristoGoogleMap
 */
 /*
Plugin Name: Custom Google Map
Plugin URI: http://server
Description: No descriptionr
Version: 1.0.0
Author: HHT
Author URI: http://server
License: GPLv2 or later
Text Domain: google-map
 */

add_action('admin_menu', 'test_plugin_setup_menu');
 
function test_plugin_setup_menu(){
    add_menu_page( 'Google maps page', 'Google Map Plugin', 'manage_options', 'Google-maps-plugin', 'front_page' );
}
 
function front_page(){
    include_once(plugin_dir_path(__FILE__).'/includes/front-page.php');
    add_marker();
    generate_markers();
    get_earthquakes();
}

defined( 'ABSPATH' ) or die( 'Error...' );

//Load Scripts
require_once(plugin_dir_path(__FILE__).'/includes/google-map-scripts.php');


//Load class 
require_once(plugin_dir_path(__FILE__).'/includes/google-map-class.php');


//Load
include_once(plugin_dir_path(__FILE__).'/includes/google-map-database.php');
register_activation_hook(__FILE__, "create_marker_table");

function register_googlemap(){
    register_widget('Google_Map_Widget');
}

add_action('widgets_init', 'register_googlemap');