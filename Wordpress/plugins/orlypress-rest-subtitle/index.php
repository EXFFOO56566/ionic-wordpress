<?php
/**
 * @version 1.0
 */
/*
Plugin Name: Orlypress - Subtitle via REST API
Plugin URI: http://www.orlyapps.de
Description: Extend the Wordpress REST API with a Subtitle
Author: Florian Strauss
Version: 1.0
*/;

add_action('init', 'orlypress_rest_api_subtitle_init', 12);

function orlypress_rest_api_subtitle_init()
{
    $post_types = get_post_types(array('public' => true), 'objects');

    foreach ($post_types as $post_type) {
        $post_type_name = $post_type->name;
        $show_in_rest = (isset($post_type->show_in_rest) && $post_type->show_in_rest) ? true : false;

        if ($show_in_rest) {
            register_rest_field($post_type_name,
                'subtitle',
                array(
                    'get_callback' => 'subtitle_get_field',
                    'schema' => null,
                )
            );
        }
    }
}

function subtitle_get_field($object, $field_name, $request)
{
    $values = get_post_meta($object['id'], 'subtitle');
    $subtitle = "";
    if (count($values) != 0) {
        $subtitle = $values[0];
    }

    return apply_filters('orlypress_rest_api_subtitle', $subtitle);
}
