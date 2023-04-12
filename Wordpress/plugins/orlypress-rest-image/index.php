<?php
/**
 * @version 1.0
 */
/*
Plugin Name: Orlypress - Better Rest Image
Plugin URI: http://www.orlyapps.de
Description: Extend the Wordpress REST API with a better featured image
Author: Florian Strauss
Version: 1.0
*/;

add_action('init', 'orlypress_rest_api_featured_images_init', 12);

function orlypress_rest_api_featured_images_init()
{
    $post_types = get_post_types(array('public' => true), 'objects');

    foreach ($post_types as $post_type) {
        $post_type_name = $post_type->name;
        $show_in_rest = (isset($post_type->show_in_rest) && $post_type->show_in_rest) ? true : false;
        $supports_thumbnail = post_type_supports($post_type_name, 'thumbnail');

        if ($show_in_rest && $supports_thumbnail) {
            register_rest_field($post_type_name,
                'featured_image',
                array(
                    'get_callback' => 'featured_images_get_field',
                    'schema' => null,
                )
            );
        }
    }
}

function featured_images_get_field($object, $field_name, $request)
{

    // Only proceed if the post has a featured image.
    if (!empty($object['featured_media'])) {
        $image_id = (int) $object['featured_media'];
    } elseif (!empty($object['featured_image'])) {
        $image_id = (int) $object['featured_image'];
    } else {
        return;
    }

    $image = get_post($image_id);

    if (!$image) {
        return;
    }

    // This is taken from WP_REST_Attachments_Controller::prepare_item_for_response().
    $featured_image['id'] = $image_id;
    $featured_image['alt_text'] = get_post_meta($image_id, '_wp_attachment_image_alt', true);
    $featured_image['caption'] = $image->post_excerpt;
    $featured_image['description'] = $image->post_content;
    $featured_image['media_type'] = wp_attachment_is_image($image_id) ? 'image' : 'file';
    $featured_image['media_details'] = wp_get_attachment_metadata($image_id);
    $featured_image['post'] = !empty($image->post_parent) ? (int) $image->post_parent : null;
    $featured_image['source_url'] = wp_get_attachment_url($image_id);

    if (empty($featured_image['media_details'])) {
        $featured_image['media_details'] = new stdClass();
    } elseif (!empty($featured_image['media_details']['sizes'])) {
        $img_url_basename = wp_basename($featured_image['source_url']);
        foreach ($featured_image['media_details']['sizes'] as $size => &$size_data) {
            $image_src = wp_get_attachment_image_src($image_id, $size);
            if (!$image_src) {
                continue;
            }
            $size_data['source_url'] = $image_src[0];
        }
    } else {
        $featured_image['media_details']['sizes'] = new stdClass();
    }

    return apply_filters('better_rest_api_featured_image', $featured_image, $image_id);
}
