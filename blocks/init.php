<?php
/**
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package gitBlock
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class gitBlock {

	public function __construct() {

		add_action( 'enqueue_block_assets', array( $this, 'gitblock_block_assets' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'gitblock_editor_assets' ) );
		add_action( 'admin_init', array( $this, 'add_github_auth_section' ) );
		add_filter( 'plugin_action_links_' . plugin_basename( plugin_dir_path( plugin_dir_path( __FILE__ ) ) . 'gitblock.php' ), array( $this, 'add_action_links' ) );
	}

	/**
	 * Enqueue block assets for both frontend + backend.
	 *
	 * @uses  {wp-editor} for WP editor styles.
	 * @since 1.0.0
	 */
	public function gitblock_block_assets() {
		wp_enqueue_style(
			'gitblock-style-css',
			plugins_url( 'blocks/build/blocks.style.build.css', dirname( __FILE__ ) ),
			array( 'wp-editor' ),
			GITBLOCK_VERSION
		);
	}

	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 *
	 * @uses  {wp-blocks} for block type registration & related functions.
	 * @uses  {wp-element} for WP Element abstraction — structure of blocks.
	 * @uses  {wp-i18n} to internationalize the block's text.
	 * @uses  {wp-editor} for WP editor styles.
	 * @since 1.0.0
	 */
	public function gitblock_editor_assets() {
		wp_enqueue_script(
			'gitblock-block-js',
			plugins_url( '/blocks/build/blocks.build.js', dirname( __FILE__ ) ),
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),
			GITBLOCK_VERSION
		);

		// Styles.
		wp_enqueue_style(
			'gitblock-block-editor-css',
			plugins_url( 'blocks/build/blocks.editor.build.css', dirname( __FILE__ ) ),
			array( 'wp-edit-blocks' ),
			GITBLOCK_VERSION
		);

		wp_localize_script(
			'gitblock-block-js',
			'gitblock_var',
			array(
				'token'       => esc_js( get_option( 'gitblock_oauth_token', false ) ),
				'settingsURL' => esc_url( admin_url( 'options-general.php#gitblock-oauth' ) ),
			)
		);
	}

	/**
	 * Add github oauth section and fields.
	 *
	 * @return void
	 */
	public function add_github_auth_section() {

		add_settings_section(
			'gitblock',
			__( 'Github OAuth Token', 'gitblock' ),
			array( $this, 'get_auth_description' ),
			'general'
		);

		add_settings_field(
			'gitblock_oauth_token',
			__( 'Enter Github OAuth Token', 'gitblock' ),
			array( $this, 'get_oauth_input' ),
			'general',
			'gitblock',
			array(
				'gitblock_oauth_token'
			)
		);

		register_setting( 'general', 'gitblock_oauth_token', 'esc_attr' );
	}


	/**
	 * Get section description.
	 */
	public function get_auth_description() {
		echo '<p id="gitblock-oauth">';
		esc_html_e( 'Enter your Github OAuth Token to fetch data from Github.', 'gitblock' );
		echo '</p>';
	}

	/**
	 * Get section markup.
	 *
	 * @param array $args array of fields.
	 */
	public function get_oauth_input( $args ) {
		$option = get_option( $args[0] );
		echo '<input type="text" id="' . esc_attr( $args[0] ) . '" name="' . esc_attr( $args[0] ) . '" value="' . esc_attr( $option ) . '"  style="width: 350px;" />';
	}

	/**
	 * Add Settings to plugin action links.
	 *
	 * @param array $links An array of plugin action links.
	 *
	 * @return array
	 */
	public function add_action_links ( $links ) {

		$plugin_links = array(
			'<a href="' . admin_url( 'options-general.php#gitblock-oauth' ) . '">' . esc_html__( 'Settings', 'gitblock' ) . '</a>',
		);

		return array_merge( $links, $plugin_links );
	}
}




