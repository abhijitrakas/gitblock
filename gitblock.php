<?php
/**
 * Plugin Name: gitblock — Github Block Plugin
 * Plugin URI: https://github.com/thrijith/gitblock/
 * Description: gitblock — is a plugin for adding Github blocks.
 * Author: thrijith
 * Author URI: https://github.com/thrijith/
 * Textdomain: gitblock
 * Domain Path: /languages
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package gitBlock
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Store Plugin version for internal use.
if ( ! defined( 'GITBLOCK_VERSION' ) ) {
	/**
	 * The version of the plugin
	 *
	 * @since  1.0.0
	 */
	define( 'GITBLOCK_VERSION', '1.0.0' );
}

add_action( 'init', 'gitblock_init', 1 );

function gitblock_init() {

	require_once plugin_dir_path( __FILE__ ) . 'blocks/init.php';
	require_once __DIR__ . '/vendor/autoload.php';

	load_plugin_textdomain(
		'gitblock',
		false,
		plugin_dir_path( __FILE__ ) . 'languages'
	);

	new gitBlock();
}
