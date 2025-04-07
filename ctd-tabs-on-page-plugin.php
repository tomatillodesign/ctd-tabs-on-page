<?php
/**
 * Plugin Name: Code the Dream Custom Tabs 🤩
 * Description: Provides Tab Group + Single Tab ACF blocks with 3-level nesting and URL hash deep linking.
 * Version: 1.0
 * Author: Code the Dream & Tomatillo Design
 * Author URI: https://codethedream.org
 */


 /*
Plugin Structure:

    assets/
    ├── editor.css           # Custom editor-only CSS
    ├── slug-preview.js      # Slug preview in ACF sidebar
    ├── tabs.css             # Frontend + editor tab styles
    ├── tabs.js              # Frontend tab functionality and mobile switching

    blocks/
    ├── ctd-single-tab/
    │   ├── block.json              # Block registration for Single Tab + contents
    │   └── ctd-single-tab.php      # Render template for Single Tab + contents
    │
    ├── ctd-tab-group/
    │   ├── block.json              # Block registration for Tab Group
    │   └── ctd-tab-group.php       # Render template for Tab Group

ctd-tabs-on-page-plugin.php         # Main plugin file

*/



// Abort if this file is called directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Check if ACF PRO is active
add_action( 'admin_init', function() {
    if ( ! class_exists( 'ACF' ) || ! defined( 'ACF_PRO' ) ) {
        deactivate_plugins( plugin_basename( __FILE__ ) );

        add_action( 'admin_notices', function() {
            echo '<div class="notice notice-error"><p><strong>Code the Dream Custom Tabs</strong> requires the <a href="https://www.advancedcustomfields.com/pro/" target="_blank">ACF PRO</a> plugin to be installed and active.</p></div>';
        } );
    }
} );



// 1. Register blocks from their folder (block.json + template)
add_action('init', function() {

    wp_register_script(
        'ctd-tabs',
        plugin_dir_url(__FILE__) . 'assets/tabs.js',
        [],
        null,
        true
    );
    wp_register_style(
        'ctd-tabs',
        plugin_dir_url(__FILE__) . 'assets/tabs.css',
        [],
        null
    );
    wp_register_style(
        'ctd-tabs-editor',
        plugin_dir_url(__FILE__) . 'assets/editor.css',
        [],
        null
    );

    register_block_type( plugin_dir_path( __FILE__ ) . 'blocks/ctd-tab-group' );
    register_block_type( plugin_dir_path( __FILE__ ) . 'blocks/ctd-single-tab' );

});


// custom JS functionality in the editor
add_action('enqueue_block_editor_assets', function() {
    wp_enqueue_script(
        'ctd-tab-group-slug-preview',
        plugin_dir_url(__FILE__) . 'assets/slug-preview.js', // your JS file
        ['acf-input'],
        null,
        true
    );
});




// 2. Register ACF fields programmatically
add_action('acf/include_fields', function() {
    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group([
            'key' => 'group_tab_group',
            'title' => 'Tab Group Settings',
            'fields' => [
                [
                    'key' => 'field_tab_group_id',
                    'label' => 'Tab Group ID',
                    'name' => 'tab_group_id',
                    'type' => 'text',
                    'instructions' => 'Internal use only, will not be visible',
                    'required' => 0,
                ]
            ],
            'location' => [[['param' => 'block', 'operator' => '==', 'value' => 'acf/ctd-tab-group']]],
        ]);

        acf_add_local_field_group([
            'key' => 'group_single_tab',
            'title' => 'Single Tab Settings',
            'fields' => [
                [
                    'key' => 'field_tab_label',
                    'label' => 'Tab Label',
                    'name' => 'tab_label',
                    'type' => 'text',
                    'instructions' => 'Enter the tab title shown to users.',
                    'required' => 1,
                ]
            ],
            'location' => [[['param' => 'block', 'operator' => '==', 'value' => 'acf/ctd-single-tab']]],
        ]);
    }
});



// Sluggify the Tab Group ID on save, even inside ACF blocks
add_filter('acf/validate_value/name=tab_group_id', function($valid, $value, $field, $input) {
    if (is_admin() && is_string($value)) {
        $_POST['acf'][$field['key']] = sanitize_title($value);
    }
    return $valid;
}, 10, 4);



