/**
 * External dependencies
 */
const { sync: spawn } = require( 'cross-spawn' );
const { sync: resolveBin } = require( 'resolve-bin' );

/**
 * Internal dependencies
 */
const { getArgFromCLI, getWebpackArgs, hasArgInCLI } = require( '../utils' );

if ( hasArgInCLI( '--webpack-no-externals' ) ) {
	process.env.WP_NO_EXTERNALS = true;
}

if ( hasArgInCLI( '--webpack-bundle-analyzer' ) ) {
	process.env.WP_BUNDLE_ANALYZER = true;
}

if ( hasArgInCLI( '--webpack--devtool' ) ) {
	process.env.WP_DEVTOOL = getArgFromCLI( '--webpack--devtool' );
}

if ( hasArgInCLI( '--webpack-copy-php' ) ) {
	process.env.WP_COPY_PHP_FILES_TO_DIST = true;
}

const { status } = spawn(
	resolveBin( 'webpack' ),
	[ hasArgInCLI( '--hot' ) ? 'serve' : 'watch', ...getWebpackArgs() ],
	{
		stdio: 'inherit',
	}
);
process.exit( status );
