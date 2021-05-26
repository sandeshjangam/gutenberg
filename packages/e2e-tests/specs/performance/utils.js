/**
 * External dependencies
 */
import { existsSync, readFileSync, unlinkSync } from 'fs';

export function readFile( filePath ) {
	return existsSync( filePath )
		? readFileSync( filePath, 'utf8' ).trim()
		: '';
}

export function deleteFile( filePath ) {
	if ( existsSync( filePath ) ) {
		unlinkSync( filePath );
	}
}

function isKeyEvent( item ) {
	return (
		item.cat === 'devtools.timeline' &&
		item.name === 'EventDispatch' &&
		item.dur &&
		item.args &&
		item.args.data
	);
}

function isKeyDownEvent( item ) {
	return isKeyEvent( item ) && item.args.data.type === 'keydown';
}

function isKeyPressEvent( item ) {
	return isKeyEvent( item ) && item.args.data.type === 'keypress';
}

function isKeyUpEvent( item ) {
	return isKeyEvent( item ) && item.args.data.type === 'keyup';
}

function isFocusEvent( item ) {
	return isKeyEvent( item ) && item.args.data.type === 'focus';
}

function isClickEvent( item ) {
	return isKeyEvent( item ) && item.args.data.type === 'click';
}

function isMouseOverEvent( item ) {
	return isKeyEvent( item ) && item.args.data.type === 'mouseover';
}

function isMouseOutEvent( item ) {
	return isKeyEvent( item ) && item.args.data.type === 'mouseout';
}

function getEventDurationsForType( trace, filterFunction ) {
	return trace.traceEvents
		.filter( filterFunction )
		.map( ( item ) => item.dur / 1000 );
}

export function getTypingEventDurations( trace ) {
	return [
		getEventDurationsForType( trace, isKeyDownEvent ),
		getEventDurationsForType( trace, isKeyPressEvent ),
		getEventDurationsForType( trace, isKeyUpEvent ),
	];
}

export function getSelectionEventDurations( trace ) {
	return [ getEventDurationsForType( trace, isFocusEvent ) ];
}

export function getClickEventDurations( trace ) {
	return [ getEventDurationsForType( trace, isClickEvent ) ];
}

export function getHoverEventDurations( trace ) {
	return [
		getEventDurationsForType( trace, isMouseOverEvent ),
		getEventDurationsForType( trace, isMouseOutEvent ),
	];
}

export async function getLoadingDurations() {
	return await page.evaluate( () => {
		const [
			{ responseStart, loadEventEnd },
		] = performance.getEntriesByType( 'navigation' );
		const paintTimings = performance.getEntriesByType( 'paint' );
		return {
			firstByte: responseStart,
			firstPaint: paintTimings.find(
				( { name } ) => name === 'first-paint'
			).startTime,
			loaded: loadEventEnd,
			firstContentfulPaint: paintTimings.find(
				( { name } ) => name === 'first-contentful-paint'
			).startTime,
			firstBlock: performance.now(),
		};
	} );
}
