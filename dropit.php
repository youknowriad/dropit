<?php
/**
 * Plugin Name: Drop it
 * Plugin URI: https://github.com/youknowriad/dropit
 * Description: Easily insert free photos from unsplash.com right from Gutenberg's sidebar.
 * Version: 1.1.0
 * Text Domain: dropit
 * Domain Path: /languages
 * Author: Riad Benguella
 *
 * @package dropit
 */

 // Some common utilities
require_once dirname( __FILE__ ) . '/lib/common.php';

// Registering Script Files
require_once dirname( __FILE__ ) . '/lib/i18n-script.php';
require_once dirname( __FILE__ ) . '/lib/sidebar-script.php';
