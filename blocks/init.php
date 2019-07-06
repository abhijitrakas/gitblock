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
		$this->register_dynamic_block();
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

	/**
	 * Function to register server siteRendering.
	 *
	 * @return void
	 */
	public function register_dynamic_block() {

		/**
		 * Register render_callback for GitHub User Block
		 */
		register_block_type(
			'gitblock/user',
			[
				'attributes'      => [
					'userName'     => [
						'type' => 'string',
					],
					'userSelected' => [
						'type'    => 'string',
						'default' => null,
					],
				],
				'render_callback' => [ $this, 'render_block_github_user' ],
			]
		);

	}

	/**
	 * Function to render GitHub User block.
	 *
	 * @param array $attributes Attributes of block.
	 *
	 * @return void
	 */
	public function render_block_github_user( $attributes ) {

		if ( empty( $attributes['userName'] ) ) {
			return;
		}

		ob_start();

		$git_api   = new \Github\Client();
		$user      = $git_api->api( 'user' )->show( $attributes['userName'] );
		$user_orgs = $git_api->api( 'user' )->organizations( $attributes['userName'] );

		if ( empty( $user['login'] ) || empty( $user_orgs ) ) {
			esc_html_e( 'No user data found please try again.', 'gitblock' );
			return ob_get_clean();
		}
		?>
		<div class="wp-block-gitblock-user">
			<div class="gitcard">
				<div class="additional">
					<div class="user-card">
						<div class="login_top center">
							<?php echo esc_html( $user['login'] ); ?>
						</div>
						<div class="profile_link center">
							<a href=<?php echo esc_url( $user['html_url'] ); ?> target="_blank" rel="noopener noreferrer">
								<?php esc_html_e( 'Visit Profile', 'gitblock' ); ?>
							</a>
						</div>
						<img alt="<?php esc_attr_e( 'User Avatar', 'gitblock' ); ?>" src="<?php echo esc_url( $user['avatar_url'] ); ?>" />
					</div>
					<div class="more-info">
						<div class="coords">
							<h6><?php esc_html_e( 'User Organisations', 'gitblock' ); ?></h6>
							<div class="orgContainer" title="<?php esc_attr_e( 'Scroll to view all organisations if not visible.', 'gitblock' ); ?>">
							<?php
								foreach ( $user_orgs as $user_org ) {
									?>
									<a href="<?php echo esc_url( $user_org['repos_url'] ); ?>" target="_blank" rel="noopener noreferrer">
										<img src="<?php echo esc_url( $user_org['avatar_url'] ); ?>" alt="<?php echo esc_attr( $user_org[ 'login' ] ); ?>" />
									</a>
									<?php
								}
							?>
							</div>
						</div>
						<div class="stats">
							<div>
								<div class="title">
									<?php esc_html_e( 'Repositories', 'gitblock' ); ?>
								</div>
								<a href='https://github.com/<?php echo esc_attr( $user['login'] ); ?>?tab=repositories' class="profile_links" target="_blank" rel="noopener noreferrer">
									<i class="fab fa-github-alt"></i>
									<div class="value"><?php echo esc_html( $user['public_repos'] ); ?></div>
								</a>
							</div>
							<div>
								<div class="title">
									<?php esc_html_e( 'Followers', 'gitblock' ); ?>
								</div>
								<a href="https://github.com/<?php echo esc_attr( $user['login'] ); ?>?tab=followers" class="profile_links" target="_blank" rel="noopener noreferrer">
									<i class="fas fa-users"></i>
									<div class="value">
										<?php echo esc_html( $user['followers'] ); ?>
									</div>
								</a>
							</div>
							<div>
								<div class="title">
									<?php esc_html_e( 'Following', 'gitblock' ); ?>
								</div>
								<a href="https://github.com/<?php echo esc_attr( $user['login'] ); ?>?tab=following" class="profile_links" target="_blank" rel="noopener noreferrer">
									<i class="fas fa-user-friends"></i>
									<div class="value">
										<?php echo esc_html( $user['following'] ); ?>
									</div>
								</a>
							</div>

						</div>
					</div>
				</div>
				<div class="general">
					<span>
						<?php esc_html_e( 'Joined: ', 'gitblock' ); ?>
						<?php echo esc_html( date( 'd l Y', strtotime( $user['created_at'] ) ) ); ?>
					</span>
					<br />
					<span>
						<?php esc_html_e( 'Company: ', 'gitblock' ); ?>
						<?php echo esc_html( $user['company'] ); ?>
					</span>
					<br />
					<span>
						<?php esc_html_e( 'Bio: ', 'gitblock' ); ?>
						<?php echo esc_html( $user['bio'] ); ?></span>
					<br />
					<span>
						<?php esc_html_e( 'Location: ', 'gitblock' ); ?>
						<?php echo esc_html( $user['location'] ); ?>
					</span>
				</div>
			</div>
		</div>
		<?php

		return ob_get_clean();
	}
}
