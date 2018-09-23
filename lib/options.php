<?php
defined( 'ABSPATH' )
or die ( '-No-' );

/**
 * custom option and settings
 */
function dropit_settings_init() {
	register_setting( 'dropit', 'dropit_options' );

	add_settings_section(
		'dropit_modules_enabled',
		__( 'Enable / disable sidebars', 'dropit' ),
		'dropit_fields_modules',
		'dropit'
	);

	add_settings_field(
		'dropit_modules_enabled',
		__( 'Modules enabled', 'dropit' ),
		'dropit_fields_modules',
		'dropit',
		'dropit_section_modules'
	);
}

/**
 * register our dropit_settings_init to the admin_init action hook
 */
add_action( 'admin_init', 'dropit_settings_init' );

/**
 * @param $args
 * custom option and settings:
 * callback functions
 */
function dropit_section_modules( $args ) {
	?>
    <p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Define here which modules can be enabled, e.g Giphy, Unsplash.', 'dropit' ); ?></p>
	<?php
}

function dropit_fields_modules() {

	$options = get_option( 'dropit_options' );
	?>
    <p>
        <label for="unsplash-enable">
            <input <?php echo ( ! empty( $options['modules_enabled']['unsplash'] ) ) ? checked( $options['modules_enabled']['unsplash'], 1, 0 ) : ''; ?>
                    id="unsplash-enable" type="checkbox"
                    name="dropit_options[modules_enabled][unsplash]" value="1"/>
			<?php esc_html_e( 'Unsplash', 'dropit' ); ?>
        </label>
    </p>
    <p>
        <label for="giphy-enable">
            <input <?php echo ( ! empty( $options['modules_enabled']['giphy'] ) ) ? checked( $options['modules_enabled']['giphy'], 1, 0 ) : ''; ?>
                    id="giphy-enable" type="checkbox"
                    name="dropit_options[modules_enabled][giphy]" value="1"/>
			<?php esc_html_e( 'Giphy', 'dropit' ); ?>
        </label>
    </p>
	<?php
}

/**
 * top level menu
 */
function dropit_options_page() {
	// add top level menu page
	add_menu_page(
		__( 'Drop it', 'dropit' ),
		__( 'Drop it', 'dropit' ),
		'manage_options',
		'dropit',
		'dropit_options_page_html',
		dropit_url( 'assets/icon-option-page.svg' )
	);
}

/**
 * register our dropit_options_page to the admin_menu action hook
 */
add_action( 'admin_menu', 'dropit_options_page' );

/**
 * top level menu:
 * callback functions
 */
function dropit_options_page_html() {

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if ( isset( $_GET['settings-updated'] ) ) {
		add_settings_error( 'dropit_messages', 'dropit_message', __( 'Settings Saved', 'dropit' ), 'updated' );
	}
	settings_errors( 'dropit_messages' );
	?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <form action="options.php" method="post">
			<?php
			settings_fields( 'dropit' );
			do_settings_sections( 'dropit' );
			submit_button( __( 'Save Settings', 'dropit' ) );
			?>
        </form>
    </div>
	<?php
}