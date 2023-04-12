<?php

/**
 * @version 1.0
 */
/*
Plugin Name: Orlypress - Post Type Location with REST API
Plugin URI: http://www.orlyapps.de
Description: Extend the Wordpress REST API with a location attribute from geo-my-wp
Author: Florian Strauss
Version: 1.0
*/

class Orlypress_Location
{
    public function __construct()
    {
        add_action('init', array($this, 'add_custom_post_type'));
        add_action('init', array($this, 'create_taxonomies'), 0);

        add_action('restrict_manage_posts', array($this, 'restrict_manage_posts'));

        add_filter('manage_orlypress_location_posts_columns', array($this, 'columns'));
        add_filter('manage_orlypress_location_posts_custom_column', array($this, 'columns_value'), 10, 2);
    }


    public function columns($columns)
    {
        $columns['category'] = 'Category';
        return $columns;
    }
    public function columns_value($column_name, $post_ID)
    {
        if ($column_name == 'category') {
            $categories = get_the_terms($post_ID, 'location_categories');
            foreach ($categories as $category) {
                echo $category->name.',';
            }
        }
    }

    public function add_custom_post_type()
    {
        $labels = array(
            'name' => _x('Locations', 'orlypress_location'),
            'menu_name' => _x('Locations', 'orlypress_location'),
            'add_new' => _x('Add New ', 'orlypress_location'),
            'add_new_item' => _x('Add New Location', 'orlypress_location'),
            'new_item' => _x('New Location', 'orlypress_location'),
            'all_items' => _x('All Locations', 'orlypress_location'),
            'edit_item' => _x('Edit Location', 'orlypress_location'),
            'view_item' => _x('View Location', 'orlypress_location'),
            'search_items' => _x('Search Locations', 'orlypress_location'),
            'not_found' => _x('No Locations Found', 'orlypress_location'),
        );

        $args = array(
            'labels' => $labels,
            'hierarchical' => true,
            'description' => 'WP Quiz',
            'supports' => array('title', 'editor','thumbnail','excerpt'),
            'public' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_nav_menus' => true,
            'publicly_queryable' => true,
            'exclude_from_search' => false,
            'has_archive' => true,
            'query_var' => true,
            'can_export' => true,
            'rewrite' => true,
            'capability_type' => 'post',
            'show_in_rest' => true,
            'rest_base' => 'locations',
        );

        register_post_type('orlypress_location', $args);
    }

    public function create_taxonomies()
    {
        register_taxonomy(
                'location_categories',
                'orlypress_location',
                array(
                    'labels' => array(
                        'name' => 'Location Category',
                        'add_new_item' => 'Add New Location Category',
                        'new_item_name' => 'New Location Category',
                    ),
                    'show_ui' => true,
                    'show_tagcloud' => false,
                    'hierarchical' => true,
                    'show_in_rest' => true,
                    'rest_base' => 'location-categories',
                )
        );
    }
    public function restrict_manage_posts()
    {
        global $typenow;
        $taxonomy = 'location_categories';
        if ($typenow ==  'orlypress_location') {
            $filters = array($taxonomy);
            foreach ($filters as $tax_slug) {
                $tax_obj = get_taxonomy($tax_slug);
                $tax_name = $tax_obj->labels->name;
                $terms = get_terms($tax_slug);
                echo "<select name='$tax_slug' id='$tax_slug' class='postform'>";
                echo "<option value=''>Show All $tax_name</option>";
                foreach ($terms as $term) {
                    echo '<option value='.$term->slug, $_GET[$tax_slug] == $term->slug ? ' selected="selected"' : '','>'.$term->name.' ('.$term->count.')</option>';
                }
                echo '</select>';
            }
        }
    }
}

$location = new Orlypress_Location();

add_action('init', 'orlypress_rest_api_location_init', 12);

function orlypress_rest_api_location_init()
{
    $post_types = get_post_types(array('public' => true), 'objects');

    foreach ($post_types as $post_type) {
        $post_type_name = $post_type->name;
        $show_in_rest = (isset($post_type->show_in_rest) && $post_type->show_in_rest) ? true : false;

        if ($show_in_rest) {
            register_rest_field($post_type_name,
                'location',
                array(
                    'get_callback' => 'location_get_field',
                    'schema' => null,
                )
            );
        }
    }
}

function location_get_field($object, $field_name, $request)
{
    global $wpdb;
    $location = $wpdb->get_row("SELECT * FROM `{$wpdb->prefix}places_locator` WHERE `post_id` = {$object['id']}");
    return $location;
}
