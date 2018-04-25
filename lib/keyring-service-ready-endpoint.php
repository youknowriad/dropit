<?php

/**
 * REST API endpoint returning the list of installed plugins
 *
 * @since 1.1.0
 *
 * @return array
 */
function dropit_get_plugins_endpoint() {
	$keyring_active = class_exists('Keyring_Service_Google');
	$google_service_active = false;
	if ( $keyring_active ) {
		$google_service = Keyring::get_service_by_name( 'google' );
		$google_service_active = ! is_null( $google_service );
	}

	return array(
		'google' => array(
			'ready' => $keyring_active && $google_service_active
		),
		'keyring' => array(
			'ready' => $keyring_active
		)
	);
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'dropit/v1', '/services', array(
		'methods' => 'GET',
		'callback' => 'dropit_get_plugins_endpoint',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		}
	) );
} );