<?php
    function gm_add_scripts(){
        //Add Main Css
        wp_enqueue_style('gm-main-style', plugins_url().'/google-map/css/styles.css');

        //Add Main JS
        wp_enqueue_script('gm-main-script', plugins_url().'/google-map/js/main.js');

        //Google map API
        wp_register_script('google', 'https://maps.googleapis.com/maps/api/js?callback=initMap');
        wp_enqueue_script('google');
    }

    add_action('wp_enqueue_scripts', 'gm_add_scripts');