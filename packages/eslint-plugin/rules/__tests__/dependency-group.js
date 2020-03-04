/**
 * External dependencies
 */
import { RuleTester } from 'eslint';

/**
 * Internal dependencies
 */
import rule from '../dependency-group';

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 6,
	},
} );

ruleTester.run( 'dependency-group', rule, {
	valid: [
		{
			code: `
/**
 * External dependencies
 */
import { get } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import edit from './edit';`,
		},
		{
			code: `
/**
 * External dependencies
 */
import { get } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CoolComponent from 'my-awesome-alias';
import edit from './edit';`,
			options: [
				{ isInternalDependencyPatterns: [ '^my-awesome-alias$' ] },
			],
		},
	],
	invalid: [
		{
			code: `
import { get } from 'lodash';
import classnames from 'classnames';
/*
 * wordpress dependencies.
 */
import { Component } from '@wordpress/element';
import edit from './edit';`,
			errors: [
				{
					messageId: 'expectExternal',
				},
				{
					messageId: 'expectWordPress',
				},
				{
					messageId: 'expectInternal',
				},
			],
			output: `
/**
 * External dependencies
 */
import { get } from 'lodash';
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */
import edit from './edit';`,
		},
	],
} );
