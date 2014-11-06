( function ( $ ) {
	/**
	 * TemplateData Reorder Widget
	 * @param {Object} config Dialog configuration object
	 */
	ReorderWidget = function ReorderWidget( config ) {
		// Config intialization
		config = config || {};

		// Parent constructor
		ReorderWidget.super.call( this, config );

		// Mixin constructors
		OO.ui.GroupWidget.call( this, $.extend( {}, config, { $group: this.$element } ) );

		// Properties
		this.dragItem = null;
		this.dragover = null;
		this.itemKeys = {};
		this.$placeholder = $( '<div>' )
			.addClass( 'reorderWidget-placeholder' );

		// Aggregate drag drop events in items
		this.aggregate( {
			dragstart: 'itemDragStart',
//			dragover: 'itemDragOver',
			drop: 'itemDrop'
		} );

		// Item events
		this.connect( this, {
			itemDragStart: 'onItemDragStart',
			itemDragOver: 'onItemDragOver',
			itemDrop: 'onItemDrop'
		} );

		// Group events
		this.$element.on( {
			drag: $.proxy( this.onDrag, this ),
			dragover: $.proxy( this.onDragOver, this )
		} );

		// Add items
		if ( $.isArray( config.items ) ) {
			this.addItems( config.items );
		}
		// Initialize
		this.$element
			.addClass( 'reorderWidget' )
			.prepend( this.$placeholder );
	};

	/* Setup */
	OO.inheritClass( ReorderWidget, OO.ui.Widget );

	// Need to mixin base class as well
	OO.mixinClass( ReorderWidget, OO.ui.GroupElement );
	OO.mixinClass( ReorderWidget, OO.ui.GroupWidget );

	/* Events */

	/* Methods */

	/**
	 * Respond to item drag start event
	 * @param {ReorderItemWidget} item Dragged item
	 */
	ReorderWidget.prototype.onItemDragStart = function ( item ) {
		// Set the height of the indicator
		this.$placeholder.css( 'height', this.items[0].$element.outerHeight() || 20 );
		this.setDragItem( item );
	};

	ReorderWidget.prototype.onItemDrop = function ( item ) {
		console.log( 'itemDrop', this.dragItem.getKey(), item.getKey() );
		this.unsetDragItem();
	};

	ReorderWidget.prototype.onItemDragOver = function ( item ) {
		console.log( 'dragging over', item.getKey() );
		this.dragover = item;
	};

	/**
	 * Respond to mouse move event
	 * @param {jQuery.event} event Event details
	 */
	ReorderWidget.prototype.onDrag = function ( event ) {
		var dragOverObj, $optionWidget, itemOffset, itemWidth, itemMidpoint,
			dragPosition, side, itemIndex, sidePosition,
			pageX = event.originalEvent.pageX,
			pageY = event.originalEvent.pageY,
			widgetOffset = this.$element.offset();

		// Get the OptionWidget item we are dragging over
		dragOverObj = this.getElementDocument().elementFromPoint( pageX, pageY );
		$optionWidget = $( dragOverObj ).closest( '.reorderItemWidget' );
		itemOffset = $optionWidget.offset();
		itemKey = $optionWidget.data( 'key' );

		if ( itemOffset && itemKey !== this.dragItem.getKey() ) {
			// Calculate where the mouse is relative to the item
			itemWidth = $optionWidget.outerWidth();
			itemMidpoint = itemOffset.left + itemWidth / 2;
			dragPosition = pageX - widgetOffset.left;

			// Which side of the item we hover over will dictate
			// where the placeholder will appear, on the left or
			// on the right
			side = dragPosition < itemMidpoint ? 'left' : 'right';
			sidePosition = dragPosition < itemMidpoint ? itemOffset.left : itemOffset.left + itemWidth;
console.log( sidePosition );
			// Add spacing between objects with the placeholder
			if ( side ) {
				this.$placeholder
					.css( 'left', sidePosition )
					.show();
			} else {
				this.$placeholder
					.css( 'left', 0 )
					.hide();
			}
		} else {
			// This means the item was dragged outside the widget
			this.$placeholder
				.css( 'left', 0 )
				.hide();
		}

	};

	/**
	 * Respond to dragover event on the widget
	 * Note: This is only tiggered if the object is dragged over
	 *  pieces of the widget that do not include items. If the
	 *  object is dragged over items, the dragover event is not
	 *  emitted, and we have to trust the individual items' dragover
	 *  event instead.
	 * @param {[type]} event [description]
	 * @return {[type]} [description]
	 */
	ReorderWidget.prototype.onDragOver = function ( event ) {
		console.log( 'global drag over' );
		this.dragover = null;
	};

	/**
	 * Set a dragged item
	 * @param {ReorderItemWidget} item Dragged item
	 */
	ReorderWidget.prototype.setDragItem = function ( item ) {
		this.dragItem = item;
	};

	/**
	 * Unset the current dragged item
	 */
	ReorderWidget.prototype.unsetDragItem = function () {
		this.dragItem = null;
		this.$placeholder.hide();
	};

	/**
	 * Get the current dragged item
	 * @return {ReorderItemWidget|null} item Dragged item or null if no item is dragged
	 */
	ReorderWidget.prototype.getDragItem = function () {
		return this.dragItem;
	};

	/**
	 * Check if there's an item being dragged.
	 * @return {Boolean} Item is being dragged
	 */
	ReorderWidget.prototype.isDragging = function () {
		return this.getDragItem() !== null;
	};

	/**
	 * Get the current key order of the items
	 * @return {string[]} Item keys in order
	 */
	ReorderWidget.prototype.getKeyOrder = function () {
		var i,
			result = [];
		for ( i = 0; i < this.items.length; i++ ) {
			result.push( this.items[i].getKey() );
		}
		return result;
	};

	ReorderWidget.prototype.addItems = function ( items, index ) {
		// Call original
		OO.ui.GroupElement.prototype.addItems.call( this, items, index );
		// Let each item know which index it is
		this.mapItemsToKeys();
	};

	ReorderWidget.prototype.mapItemsToKeys = function () {
		var i;

		this.itemKeys = {};
		for ( i = 0; i < this.items.length; i++ ) {
			this.itemKeys[this.items[i].getKey()] = this.items[i];
		}
	};

	ReorderWidget.prototype.getItemByKey = function ( key ) {
		return this.itemKeys[key];
	};
}( jQuery ) );
