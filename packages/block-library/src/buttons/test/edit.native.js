/**
 * External dependencies
 */
// import { Image } from 'react-native';
import { render, fireEvent } from 'test/helpers';

/**
 * WordPress dependencies
 */
import { BottomSheetSettings, BlockEdit } from '@wordpress/block-editor';
import { SlotFillProvider } from '@wordpress/components';
import { registerBlockType, unregisterBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
// import { IMAGE_BACKGROUND_TYPE } from '../../cover/shared';
import { name, metadata, settings } from '../index';

// Avoid errors due to mocked stylesheet files missing required selectors
jest.mock( '@wordpress/compose', () => ( {
	...jest.requireActual( '@wordpress/compose' ),
	withPreferredColorScheme: jest.fn( ( Component ) => ( props ) => (
		<Component
			{ ...props }
			preferredColorScheme={ {} }
			getStylesFromColorScheme={ jest.fn( () => ( {} ) ) }
		/>
	) ),
} ) );

const ButtonsEdit = ( props ) => (
	<SlotFillProvider>
		<BlockEdit isSelected name={ name } clientId={ 0 } { ...props } />
		<BottomSheetSettings isVisible={ false } />
	</SlotFillProvider>
);

const setAttributes = jest.fn();
const attributes = {
	marginLeft: 10,
	// backgroundType: IMAGE_BACKGROUND_TYPE,
	// focalPoint: { x: '0.25', y: '0.75' },
	// hasParallax: false,
	// overlayColor: { color: '#000000' },
	// url: 'mock-url',
};

beforeAll( () => {
	// // Mock Image.getSize to avoid failed attempt to size non-existant image
	// const getSizeSpy = jest.spyOn( Image, 'getSize' );
	// getSizeSpy.mockImplementation( ( _url, callback ) => callback( 300, 200 ) );

	// Register required blocks
	registerBlockType( name, {
		...metadata,
		...settings,
	} );
	registerBlockType( 'core/paragraph', {
		category: 'text',
		title: 'Paragraph',
		edit: () => {},
		save: () => {},
	} );

	registerBlockType( 'core/button', {
		category: 'text',
		title: 'Button',
		edit: () => {},
		save: () => {},
	} );
} );

afterAll( () => {
	// // Restore mocks
	// Image.getSize.mockRestore();

	unregisterBlockType( name );
	unregisterBlockType( 'core/paragraph' );
	unregisterBlockType( 'core/button' );
} );

describe( 'when corner radius is changed', () => {
	it( 'corner radius is changed', async () => {
		const { debug, getByLabelText } = render(
			<ButtonsEdit
				attributes={ {
					...attributes,
					url: undefined,
					backgroundType: undefined,
				} }
				setAttributes={ setAttributes }
			/>
		);
		debug();
		fireEvent( getByLabelText( 'Border Radius' ), 'valueChange', '31' );

		// expect( setAttributes ).toHaveBeenCalledWith(
		// 	expect.objectContaining( {
		// 		focalPoint: { ...attributes.focalPoint, y: '0.52' },
		// 	} )
		// );
	} );
} );
