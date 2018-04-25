<?php

function keyring_proxy_endpoint( WP_REST_Request $request ) {
	$service_name = $request['service'];
	$url = $request['url'];
	$service = Keyring::get_service_by_name( $service_name );
	if ( $service->is_connected() ) {
		$token = current($service->get_tokens());
		$service->set_token( $token );
	}
	return $service->request( $url );
}

add_action( 'rest_api_init', function () {
  register_rest_route( 'keyring/v1', '/proxy', array(
    'methods' => 'GET',
    'callback' => 'keyring_proxy_endpoint',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		}
  ) );
} );