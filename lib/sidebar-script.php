<?php

/**
 * Registers the sidebar script
 *
 * @since 1.0.0
 */
function splash_sidebar_script_register() {
	wp_register_script(
		'splash-sidebar',
		splash_url( 'scripts/sidebar/build/index.js' ),
		array( 'wp-i18n', 'splash-i18n' ),
		filemtime( splash_dir_path() . 'scripts/sidebar/build/index.js' ),
		true
	);
	wp_register_style(
		'splash-sidebar',
		splash_url( 'scripts/splash/build/style.css' ),
		array(),
		filemtime( splash_dir_path() . 'scripts/sidebar/build/style.css' )
	);
}
add_action( 'init', 'splash_sidebar_script_register' );
