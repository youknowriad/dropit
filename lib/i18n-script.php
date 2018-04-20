<?php

/**
 * Returns Jed-formatted localization data.
 *
 * @since 1.0.0
 *
 * @param  string $domain Translation domain.
 *
 * @return array
 */
function dropit_get_jed_locale_data( $domain ) {
	$translations = get_translations_for_domain( $domain );

	$locale = array(
		'' => array(
			'domain' => $domain,
			'lang'   => is_admin() ? get_user_locale() : get_locale(),
		),
	);

	if ( ! empty( $translations->headers['Plural-Forms'] ) ) {
		$locale['']['plural_forms'] = $translations->headers['Plural-Forms'];
	}

	foreach ( $translations->entries as $msgid => $entry ) {
		$locale[ $msgid ] = $entry->translations;
	}

	return $locale;
}

/**
 * Registers the i18n script
 *
 * @since 1.0.0
 */
function dropit_i18n_register() {
	$locale_data = dropit_get_jed_locale_data( 'dropit' );
	$content = 'wp.i18n.setLocaleData( ' . json_encode( $locale_data ) . ', "dropit" );';

	wp_register_script(
		'dropit-i18n',
		dropit_url( 'scripts/i18n/build/index.js' ),
		array( 'wp-i18n' ),
		filemtime( dropit_dir_path() . 'scripts/i18n/build/index.js' )
	);
	wp_add_inline_script( 'dropit-i18n', $content );
}
add_action( 'init', 'dropit_i18n_register' );


/**
 * Load plugin text domain for translations.
 *
 * @since 1.0.0
 */
function dropit_load_plugin_textdomain() {
	load_plugin_textdomain(
		'dropit',
		false,
		plugin_basename( dropit_dir_path() ) . '/languages/'
	);
}
add_action( 'plugins_loaded', 'dropit_load_plugin_textdomain' );