<?php

function dropit_init_keyring() {

	if ( ! class_exists('Keyring_Service_OAuth2') ) {
		return;
	}

	/**
	 * Google service definition for Keyring.
	 * API: https://developers.google.com/
	 * OAuth implementation: https://developers.google.com/accounts/docs/OAuth2WebServer
	 * App registration: https://code.google.com/apis/console/
	 */
	class Keyring_Service_Google extends Keyring_Service_OAuth2 {
		const NAME        = 'google';
		const LABEL       = 'Google';
		const API_VERSION = '3.0';
		const SCOPE       = 'https://www.googleapis.com/auth/userinfo.profile';

		var $self_url     = '';
		var $self_method  = '';

		function __construct() {
			parent::__construct();

			// Enable "basic" UI for entering key/secret
			if ( ! KEYRING__HEADLESS_MODE ) {
				add_action( 'keyring_google_manage_ui', array( $this, 'basic_ui' ) );
				add_filter( 'keyring_google_basic_ui_intro', array( $this, 'basic_ui_intro' ) );
			}

			// Set scope
			add_filter( 'keyring_google_request_token_params', array( $this, 'request_token_params' ) );

			// Handle Google's annoying limitation of not allowing us to redirect to a dynamic URL
			add_action( 'pre_keyring_google_verify', array( $this, 'redirect_incoming_verify' ) );

			$this->set_endpoint( 'authorize',    'https://accounts.google.com/o/oauth2/auth',     'GET'  );
			$this->set_endpoint( 'access_token', 'https://accounts.google.com/o/oauth2/token',    'POST' );
			$this->set_endpoint( 'self',         'https://www.googleapis.com/oauth2/v1/userinfo', 'GET'  );

			$creds = $this->get_credentials();
			$this->redirect_uri = $creds['redirect_uri'];
			$this->key          = $creds['key'];
			$this->secret       = $creds['secret'];

			$this->authorization_header    = 'Bearer'; // Oh, you
			$this->authorization_parameter = false;

			// Need to reset the callback because Google is very strict about where it sends people
			if ( !empty( $creds['redirect_uri'] ) ) {
				$this->callback_url = $creds['redirect_uri']; // Allow user to manually enter a redirect URI
			} else {
				$this->callback_url = remove_query_arg( array( 'nonce', 'kr_nonce' ), $this->callback_url ); // At least strip nonces, since you can't save them in your app config
			}
		}

		function basic_ui_intro() {
			echo '<p>' . sprintf( __( "Google controls access to all of their APIs through their API Console. <a href='%s'>Go to the console</a> and click the project dropdown just under the logo in the upper left of the screen. Click <strong>Create&hellip;</strong> to create a new project. Enter a name and then click <strong>Create project</strong>. You don't technically need access to any of the additional APIs, but if you want to, then feel free to enable them", 'keyring' ), 'https://code.google.com/apis/console' ) . '</p>';
			echo '<p>' . __( "Now you need to set up an OAuth Client ID.", 'keyring' ) . '</p>';
			echo '<ol>';
			echo '<li>' . __( "Click <strong>API Access</strong> in the menu on the left.", 'keyring' ) . '</li>';
			echo '<li>' . __( "Click the big blue button labelled <strong>Create an OAuth 2.0 client ID&hellip;</strong>", 'keyring' ) . '</li>';
			echo '<li>' . __( "You must enter a <strong>Product name</strong>, but you can skip the logo and home page URL", 'keyring' ) . '</li>';
			echo '<li>' . __( "Leave the Application type set to <strong>Web application</strong>", 'keyring' ) . '</li>';
			echo '<li>' . __( "Next to <strong>Your site or hostname</strong>, click <strong>(more options)</strong>", 'keyring' ) . '</li>';
			echo '<li>' . sprintf( __( "In the <strong>Authorized Redirect URIs</strong> box, enter the URL <code>%s</code>", 'keyring' ), Keyring_Util::admin_url( $this->get_name(), array( 'action' => 'verify' ) ) ) . '</li>';
			echo '<li>' . sprintf( __( "For the <strong>Authorized JavaScript Origins</strong>, enter the URL of your domain, e.g. <code>http://%s</code>", 'keyring' ), $_SERVER['HTTP_HOST'] ) . '</li>';
			echo '<li>' . __( "Click <strong>Create client ID</strong> when you're done", 'keyring' ) . '</li>';
			echo '</ol>';
			echo '<p>' . __( "Once you've saved your details, copy the <strong>Client ID</strong> into the <strong>Client ID</strong> field below, and the <strong>Client secret</strong> value into <strong>Client Secret</strong>. The Redirect URI box should fill itself out for you.", 'keyring' ) . '</p>';
		}

		function _get_credentials() {
			if (
				defined( 'KEYRING__GOOGLE_KEY' )
			&&
				defined( 'KEYRING__GOOGLE_SECRET' )
			) {
				return array(
					'redirect_uri' => defined( 'KEYRING__GOOGLE_URI' ) ? constant( 'KEYRING__GOOGLE_URI' ) : '', // optional
					'key'          => constant( 'KEYRING__GOOGLE_KEY' ),
					'secret'       => constant( 'KEYRING__GOOGLE_SECRET' ),
				);
			} else {
				return null;
			}
		}

		function request_token_params( $params ) {
			$creds = $this->get_credentials();
			$params['scope'] = self::SCOPE . ( count($creds['scopes' ]) ? ' '. implode( ' ', $creds['scopes' ] ) : '' );
			return $params;
		}

		function redirect_incoming_verify( $request ) {
			if ( !isset( $request['kr_nonce'] ) ) {
				// First request, from Google. Nonce it and move on.
				$kr_nonce = wp_create_nonce( 'keyring-verify' );
				$nonce = wp_create_nonce( 'keyring-verify-' . $this->get_name() );
				wp_safe_redirect(
					Keyring_Util::admin_url(
						$this->get_name(),
						array(
							'action'   => 'verify',
							'kr_nonce' => $kr_nonce,
							'nonce'    => $nonce,
							'state'    => $request['state'],
							'code'     => $request['code'], // Auth code from successful response (maybe)
						)
					)
				);
				exit;
			}
		}

		function build_token_meta( $token ) {
			$meta = array();
			if ( !$token ) {
				return $meta;
			}

			$token = new Keyring_Access_Token( $this->get_name(), new OAuthToken( $token['access_token'], '' ), array() );
			$this->set_token( $token );
			$response = $this->request( $this->self_url, array( 'method' => $this->self_method ) );
			if ( ! Keyring_Util::is_error( $response ) ) {
				$meta = array(
					'user_id'   => $response->id,
					'name'      => $response->name,
					'profile'   => $response->link,
					'picture'   => $response->picture,
				);
			}

			return apply_filters( 'keyring_access_token_meta', $meta, $this->get_name(), $token, $response, $this );
		}

		function get_display( Keyring_Access_Token $token ) {
			return $token->get_meta( 'name' );
		}

		function request( $url, array $params = array() ) {
			// add header (version), required for all requests
			$params['headers']['GData-Version'] = self::API_VERSION;

			return parent::request( $url, $params );
		}

		// Minor modifications from Keyring_Service::basic_ui
		function basic_ui() {
			if ( !isset( $_REQUEST['nonce'] ) || !wp_verify_nonce( $_REQUEST['nonce'], 'keyring-manage-' . $this->get_name() ) ) {
				Keyring::error( __( 'Invalid/missing management nonce.', 'keyring' ) );
				exit;
			}

			$available_scopes = array(
				array( 'name' => __( 'Google Contacts', 'keyring' ), 'scope' => 'https://www.google.com/m8/feeds' ),
				array( 'name' => __( 'Google Drive', 'keyring' ), 'scope' => 'https://www.googleapis.com/auth/drive' ),
			);

			// Common Header
			echo '<div class="wrap">';
			echo '<h2>' . __( 'Keyring Service Management', 'keyring' ) . '</h2>';
			echo '<p><a href="' . Keyring_Util::admin_url( false, array( 'action' => 'services' ) ) . '">' . __( '&larr; Back', 'keyring' ) . '</a></p>';
			echo '<h3>' . sprintf( __( '%s API Credentials', 'keyring' ), esc_html( $this->get_label() ) ) . '</h3>';

			// Handle actually saving credentials
			if ( isset( $_POST['api_key'] ) && isset( $_POST['api_secret'] ) ) {
				// Store credentials against this service
				$this->update_credentials( array(
					'key'          => stripslashes( $_POST['api_key'] ),
					'secret'       => stripslashes( $_POST['api_secret'] ),
					'redirect_uri' => stripslashes( $_POST['redirect_uri'] ),
					'scopes'       => $_POST['scopes']
				) );
				echo '<div class="updated"><p>' . __( 'Credentials saved.', 'keyring' ) . '</p></div>';
			}

			$api_key = $api_secret = $redirect_uri = '';
			$scopes = [];
			if ( $creds = $this->get_credentials() ) {
				$api_key      = $creds['key'];
				$api_secret   = $creds['secret'];
				$redirect_uri = $creds['redirect_uri'];
				$scopes       = $creds['scopes'];
			}

			echo apply_filters( 'keyring_' . $this->get_name() . '_basic_ui_intro', '' );

			if ( ! $redirect_uri ) {
				$redirect_uri = Keyring_Util::admin_url( $this->get_name(), array( 'action' => 'verify' ) );
			}

			// Output basic form for collecting key/secret
			echo '<form method="post" action="">';
			echo '<input type="hidden" name="service" value="' . esc_attr( $this->get_name() ) . '" />';
			echo '<input type="hidden" name="action" value="manage" />';
			wp_nonce_field( 'keyring-manage', 'kr_nonce', false );
			wp_nonce_field( 'keyring-manage-' . $this->get_name(), 'nonce', false );
			echo '<table class="form-table">';
			echo '<tr><th scope="row">' . __( 'Client ID', 'keyring' ) . '</th>';
			echo '<td><input type="text" name="api_key" value="' . esc_attr( $api_key ) . '" id="api_key" class="regular-text"></td></tr>';
			echo '<tr><th scope="row">' . __( 'Client Secret', 'keyring' ) . '</th>';
			echo '<td><input type="text" name="api_secret" value="' . esc_attr( $api_secret ) . '" id="api_secret" class="regular-text"></td></tr>';
			echo '<tr><th scope="row">' . __( 'Redirect URI', 'keyring' ) . '</th>';
			echo '<td><input type="text" name="redirect_uri" value="' . esc_attr( $redirect_uri ) . '" id="redirect_uri" class="regular-text"></td></tr>';
			echo '<tr><th scope="row">' . __( 'Scopes', 'keyring' ) . '</th>';
			echo '<td>';
			foreach( $available_scopes as $scope ) {
				echo '<input type="checkbox" name="scopes[]" value="' . esc_attr( $scope['scope'] ) . '" ' . ( in_array( $scope['scope'], $scopes ) ? 'checked' : '' ) .'> ' . $scope['name'] . '<br>';
			}
			echo '</td></tr>';
			echo '</table>';
			echo '<p class="submitbox">';
			echo '<input type="submit" name="submit" value="' . __( 'Save Changes', 'keyring' ) . '" id="submit" class="button-primary">';
			echo '<a href="' . esc_url( $_SERVER['HTTP_REFERER'] ) . '" class="submitdelete" style="margin-left:2em;">' . __( 'Cancel', 'keyring' ) . '</a>';
			echo '</p>';
			echo '</form>';
			echo '</div>';
		}

		function test_connection() {
			$res = $this->request( $this->self_url, array( 'method' => $this->self_method ) );
			if ( ! Keyring_Util::is_error( $res ) ) {
				return true;
			}

			return $res;
		}
	}

	Keyring_Service_Google::init();
}

add_action( 'keyring_load_services', 'dropit_init_keyring' );