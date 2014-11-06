( function ( $ ) {
	/**
	 * TemplateData Reorder Item Widget
	 * @param {Object} data Item data with key and name values
	 * @param {Object} config Item configuration object
	 */
	ReorderItemWidget = function ReorderItemWidget( data, config ) {
		// Config intialization
		config = config || {};

		// Parent constructor
		ReorderItemWidget.super.call( this, data, config );

		// Set up data
		this.setKey( data.key );
		this.setName( data.name || data.key );

		// Wrap the element with another div wrapper
		// so we can have a place to attach the placeholder
		// on drag
		this.$element = this.$( '<div>' )
			.addClass( 'reorderItemWidget-wrapper' )
			.append( this.$element );

		// Initialize and events
		this.$element
			.attr( 'draggable', true )
			.data( 'key', data.key )
			.addClass( 'reorderItemWidget' )
			.on( {
				dragstart: this.onDragStart.bind( this ),
//				dragenter: this.onDragEnter.bind( this ),
				dragleave: this.onDragLeave.bind( this ),
				dragover: this.onDragOver.bind( this ),
				dragend: this.onDragEnd.bind( this ),
				drop: this.onDrop.bind( this )
			} );
	};

	/* Setup */
	OO.inheritClass( ReorderItemWidget, OO.ui.OptionWidget );

	/* Static Properties */

	// Allow button mouse down events to pass through so they can be handled by the parent select widget
	ReorderItemWidget.static.cancelButtonMouseDownEvents = false;
	ReorderItemWidget.static.selectable = false;
	ReorderItemWidget.static.highlightable = false;

	/**
	 * @event dropped
	 * @param {string} from Item dragged
	 * @param {string} to Item dropped into
	 */

	/* Methods */

	ReorderItemWidget.prototype.onDragStart = function ( event ) {
		var dt = event.originalEvent.dataTransfer;

		this.mouseposition = event.originalEvent.pageX;

		this.$element.addClass( 'reorderItemWidget-dragging' );
		// Define drop effect
		dt.dropEffect = 'move';
		dt.effectAllowed = 'move';

		this.emit( 'dragstart', this );
		return true;
	};

	ReorderItemWidget.prototype.onDragEnd = function ( event ) {
		this.$element.removeClass( 'reorderItemWidget-dragging' );
		this.emit( 'dragend', this );
		return false;
	};

	ReorderItemWidget.prototype.onDrop = function ( event ) {
		this.emit( 'drop', this );
	};

	ReorderItemWidget.prototype.onDragOver = function ( event ) {
		this.emit( 'dragover', this );
		return false;
	};

	ReorderItemWidget.prototype.onDragLeave = function ( event ) {
		return false;
	};

	ReorderItemWidget.prototype.setKey = function ( key ) {
		this.key = key;
	};

	ReorderItemWidget.prototype.setName = function ( name ) {
		this.name = name;
		this.setLabel( name );
	};

	ReorderItemWidget.prototype.setIndex = function ( index ) {
		this.$element.data( 'index', index );
	};
	ReorderItemWidget.prototype.getIndex = function ( index ) {
		return this.$element.data( 'index' );
	};

	ReorderItemWidget.prototype.getKey = function () {
		return this.key;
	};
	ReorderItemWidget.prototype.getName = function () {
		return this.name;
	};

	ReorderItemWidget.prototype.getCorrectedMousePosition = function () {

	};

	/**
	 * Reset the data in this item
	 * @param {Object} newData New data information
	 */
	ReorderItemWidget.prototype.changeData = function ( newData ) {
		this.setKey( newData.key );
		this.setName( newData.name || newData.key );
		// Remove drag class
		this.$element.removeClass( 'reorderItemWidget-dragging' );
//		this.$placeholder.hide();
	};

}( jQuery ) );
