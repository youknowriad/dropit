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
		array( 'wp-plugins', 'wp-element', 'wp-edit-post', 'wp-i18n', 'splash-i18n' ),
		filemtime( splash_dir_path() . 'scripts/sidebar/build/index.js' ),
		true
	);
	wp_register_style(
		'splash-sidebar',
		splash_url( 'scripts/sidebar/build/style.css' ),
		array(),
		filemtime( splash_dir_path() . 'scripts/sidebar/build/style.css' )
	);
}
add_action( 'init', 'splash_sidebar_script_register' );

function splash_sidebar_script_enqueue() {
	wp_enqueue_script( 'splash-sidebar' );
	wp_enqueue_style( 'splash-sidebar' );
}
add_action( 'enqueue_block_editor_assets', 'splash_sidebar_script_enqueue' );