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

		// Aggregate drag drop events in items
		this.aggregate( {
			dragstart: 'itemDragStart',
			dragover: 'itemDragOver',
			drop: 'itemDrop'
		} );
		// Respond to events
		this.connect( this, {
			itemDragStart: 'onItemDragStart',
			itemDragOver: 'onItemDragOver',
			itemDrop: 'onItemDrop'
		} );

		this.$element.on( {
			drag: $.proxy( this.onDrag, this ),
			dragover: $.proxy( this.onDragOver, this )
		} );
		// Add items
		if ( $.isArray( config.items ) ) {
			this.addItems( config.items );
		}
		// Initialize
		this.$element.addClass( 'reorderWidget' );
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
		this.setDragItem( item );
		console.log( 'itemDragStart', this.dragItem.getKey() );

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
		var left, midpoint, $itemOver, side, itemKey,
			pageX = event.originalEvent.pageX,
			pageY = event.originalEvent.pageY;

		if ( this.dragover ) {
			itemKey = this.dragover.getKey();
			$itemOver  = this.dragover.$element;
			left = $itemOver.position().left;
			midpoint = left + $itemOver.width() / 2;
			$itemOver.animate( {
				'margin-left': '100px'
			}, 100 );
		} else {
			itemKey = '';
			$itemOver  = null;
			left = 0;
			midpoint = 0;
		}
		side = pageX < midpoint ? 'left' : 'right';

		$( '#status').html(
			'dragover: ' + this.dragover + '<br />' +
			' pageX: ' + pageX + '<br />' +
			' left: ' + left + '<br />' +
			' item: ' + itemKey + '<br />' +
			' midpoint: ' + midpoint + '<br />' +
			' side: ' + side
		);
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
