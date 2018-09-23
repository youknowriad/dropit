<?php

/**
 * Retrieves the root plugin path.
 *
 * @return string Root path to the drop it plugin.
 *
 * @since 1.0.0
 */
function dropit_dir_path() {
	return plugin_dir_path( dirname( __FILE__ ) );
}

/**
 * Retrieves a URL to a file in the drop it plugin.
 *
 * @param  string $path Relative path of the desired file.
 *
 * @return string       Fully qualified URL pointing to the desired file.
 *
 * @since 1.0.0
 */
function dropit_url( $path ) {
	return plugins_url( $path, dirname( __FILE__ ) );
}

/**
 * Get options set in admin page settings
 * @return array
 * @author Julien Maury
 */
function dropit_get_options() {

	$defaults = apply_filters( 'dropit_default_options', array(
		'modules_enabled' => array(
			'giphy'    => '1',
			'unsplash' => '1',
		),
	) );

	return wp_parse_args( (array) get_option( 'dropit_options' ), $defaults );
}