( function ( $ ) {
	/**
	 * Reorder Widget
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
		this.itemKeys = {};
		this.sideInsertion = '';

		// Aggregate drag drop events in items
		this.aggregate( {
			dragstart: 'itemDragStart',
			dragend: 'itemDragEnd',
			drop: 'itemDrop'
		} );

		// Item events
		this.connect( this, {
			itemDragStart: 'onItemDragStart',
			itemDrop: 'onItemDrop',
			itemDragEnd: 'onItemDragEnd'
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
		this.$placeholder = $( '<div>' )
			.addClass( 'reorderWidget-placeholder' );
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

	/**
	 * Respond to item drag end event
	 */
	ReorderWidget.prototype.onItemDragEnd = function () {
		// Remove the placeholder
		this.$placeholder.hide();
	};

	/**
	 * Handle drop event and switch the order of the items accordingly
	 * @param {ReorderItemWidget} item Dropped item
	 */
	ReorderWidget.prototype.onItemDrop = function ( item ) {
		var draggedItem,
			dragItemIndex = this.dragItem.getIndex(),
			insertionIndex = item.getIndex();

		this.placeItemAtIndex( this.dragItem.getIndex(), item.getIndex() );
	};

	/**
	 * Switch the place of two items
	 * @param {number} fromIndex [description]
	 * @param {number} toIndex [description]
	 */
	ReorderWidget.prototype.placeItemAtIndex = function ( fromIndex, toIndex ) {
		var draggedItem = this.items[fromIndex];

		// If the insertion point is 'after', the insertion index
		// is shifted to the right
		if ( this.sideInsertion === 'after' ) {
			toIndex++;
		}

		// Change the item position
		this.addItems( [ draggedItem ], toIndex );
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
		itemIndex = $optionWidget.data( 'index' );

		if ( itemOffset && itemIndex !== this.dragItem.getIndex() ) {
			// Calculate where the mouse is relative to the item
			itemWidth = $optionWidget.outerWidth();
			itemMidpoint = itemOffset.left + itemWidth / 2;
			dragPosition = pageX - widgetOffset.left;

			// Which side of the item we hover over will dictate
			// where the placeholder will appear, on the left or
			// on the right
			sidePosition = dragPosition < itemMidpoint ? itemOffset.left : itemOffset.left + itemWidth;
			// Store whether we are before or after an item to rearrange
			// Also account for RTL, as this is flipped
			if ( this.$element.css( 'direction' ) === 'rtl' ) {
				this.sideInsertion = dragPosition < itemMidpoint ? 'after' : 'before';
			} else {
				this.sideInsertion = dragPosition < itemMidpoint ? 'before' : 'after';
			}


			// Add drop indicator between objects
			if ( this.sideInsertion  ) {
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
		this.sideInsertion = '';
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
	 * Expand the
	 */
	ReorderWidget.prototype.addItems = function ( items, index ) {
		// Parent
		OO.ui.GroupElement.prototype.addItems.call( this, items, index );

		// Map the index of each object
		for ( i = 0; i < this.items.length; i++ ) {
			this.items[i].setIndex( i );
		};
	};

}( jQuery ) );
