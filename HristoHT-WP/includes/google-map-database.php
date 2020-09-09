<?php

function create_marker_table(){

    global $wpdb;
    require_once(ABSPATH."wp-admin/includes/upgrade.php");

    $table_name = $wpdb->prefix . "markers2";

    $table_query = "CREATE TABLE $table_name(
        id int(10) NOT NULL AUTO_INCREMENT,
        lon float,
        lat float,
        place text,
        mag float,
        tm int,
        PRIMARY KEY (id)
    )";

    dbDelta($table_query);
}