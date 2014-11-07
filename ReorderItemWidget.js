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

		// Initialize and events
		this.$element
			.attr( 'draggable', true )
			.addClass( 'reorderItemWidget' )
			.on( {
				dragstart: this.onDragStart.bind( this ),
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

	/**
	 * Respond to dragstart event.
	 * @param {jQuery.event} event jQuery event
	 * @return {boolean} True
	 * @fires dragstart
	 */
	ReorderItemWidget.prototype.onDragStart = function ( event ) {
		// Define drop effect
		event.originalEvent.dataTransfer.dropEffect = 'move';
		event.originalEvent.dataTransfer.effectAllowed = 'move';

		// Add dragging class
		this.$element.addClass( 'reorderItemWidget-dragging' );

		// Emit event
		this.emit( 'dragstart', this );
		return true;
	};

	/**
	 * Respond to dragend event.
	 * @param {jQuery.event} event jQuery event
	 * @return {boolean} False
	 */
	ReorderItemWidget.prototype.onDragEnd = function ( event ) {
		this.$element.removeClass( 'reorderItemWidget-dragging' );

		this.emit( 'dragend' );
		// Return false and prevent propogation
		return false;
	};

	/**
	 * Handle drop event.
	 * @param {jQuery.event} event jQuery event
	 * @fires drop
	 */
	ReorderItemWidget.prototype.onDrop = function ( event ) {
		this.emit( 'drop', this );
	};

	/**
	 * In order for drag/drop to work, the dragover event must
	 * return false and stop propogation.
	 * @return {boolean} False
	 */
	ReorderItemWidget.prototype.onDragOver = function () {
		return false;
	};

	/**
	 * Set item index. Store it in the dom so we can access from the widget drag event
	 * @param {number} Item index
	 */
	ReorderItemWidget.prototype.setIndex = function ( index ) {
		this.$element.data( 'index', index );
	};

	/**
	 * Get item index
	 * @return {number} Item index
	 */
	ReorderItemWidget.prototype.getIndex = function () {
		return this.$element.data( 'index' );
	};

}( jQuery ) );
