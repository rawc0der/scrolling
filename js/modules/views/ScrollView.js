define([
 'underscore',
 'backbone',
 'widget',
 'views/BufferCell',
 'models/BufferCellModel',

], function(_, Backbone, Widget, bufferCell, BufferModel){
	
	var ScrollView = Widget.extend({
		
		template: {
			templateString: '<div id="iScrollView"> <h4>iScrollView Demo</h4> <div class="ScrollContainer">  <div id="wrapper"> </div>  </div> </div>'
		},

		subviewsContainer: '#wrapper',

		subviews: [],

		viewOptions: [],

		iScroll: {
			currentIndex: -1,  // first visible li element from the scrolling list
			itemsLength: 0,
			itemHeight: 0,
			maxVisibleItems: 0,
		},   //  container object for holding internal logical values


		/*************************Default iScroll options*********************/
		_iscrollDefaults: {
			hScroll: true,
			vScroll: true,
			bounce: true,
			snap: 'li',
			bounceLock: false,
			momentum: false,
			lockDirection: true,
			useTransform: true,
			useTransition: false,
			mouseWheel: true,
			// Events
			onRefresh: null,
			onBeforeScrollStart: null,
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
		},
		/*********************************************************************/

		initialize: function(){
			Widget.prototype.initialize.call(this);
			console.log('Scroll view init:', this);
			this.fiddleWithTheOptions();
			var self = this;
			$.when( self.getScrollerHtml() ).then(function(){
				// Scroller DOM Element ready
				self.iScroll.itemHeight = self.getItemsHeight();
				self.iScroll.itemsLength = self.getItemsLength();
				self.iScroll.maxVisibleItems = self.getMaxVisibleItemsNo();
				self.iScroll.maxCurrentIndex = self.getMaxCurrentIndex();
				self.changeItemsIndexes();
			});
			$('body').css({
				background: 'gray'
			})
		},
		/**
		 *	Append scroller page html to the container
		 */
		renderScrollingList: function(scrollHtml){
			this.$el.find( this.subviewsContainer ).append( scrollHtml );
		},
		/**
		 *	Hijax scroller HTML and append to body
		 *  This method returns a DEFERRED object
		 */
		getScrollerHtml: function(){
			var dfd = $.Deferred();
			var iScroll = this;
			$.ajax({
				url: 'simple.html',
				type: 'get',
				dataType: 'html',
			}).done(function(scrollPageHtml){
				var scrollingListHtml = $(scrollPageHtml).find('#scroller');
				iScroll.renderScrollingList(scrollingListHtml);
				var style = $(scrollPageHtml)[11];
				$('body').append( $(style) );
				iScroll.myScroll = new window.iScroll(
					'wrapper',
					iScroll._iscrollDefaults
				);
				dfd.resolve();
			});
			return dfd.promise();
		},
		/**
		 *	Calculate li items height to determine the default threshhold for
		 *  updating the currentIndex
		 */
		getItemsHeight: function(){
			var itemHeight = this.$el.find( '#scroller ul' )
									 .find('li').get(0).offsetHeight;
			return itemHeight;
		},
		getItemsLength: function(){
			var itemsLength = this.$el.find( '#scroller ul' ).find('li').length;
			return itemsLength;
		},
		getMaxVisibleItemsNo: function(){
			var maxItems = Math.round( 
				this.$el.find( '#wrapper' ).height() / this.iScroll.itemHeight 
			);
			return maxItems;
		},
		getMaxCurrentIndex: function(){
			var maxIndex = this.iScroll.itemsLength -
						   this.iScroll.maxVisibleItems;
			return maxIndex;
		},
		/**
		 *	Update the layout to math the current visible items from the list
		 */
		updateViewLayout: function(e){
			var delta = Math.round( this.myScroll.y / this.iScroll.itemHeight );
			this.updateCurrentIndex(delta);
			// console.log(this.iScroll.currentIndex)
		},
		/**
		 *	Update the index by deltaItems
		 */
		updateCurrentIndex: function(deltaItems){
			// console.log(this.iScroll.currentIndex , deltaItems)
			if (   deltaItems < 0
				&& this.iScroll.currentIndex !== deltaItems 
				&& deltaItems > - this.iScroll.maxCurrentIndex - 1 )
			{
				var direction = (this.iScroll.currentIndex > deltaItems) ? 'down' : 'up';
				this.iScroll.currentIndex = ( deltaItems < 0 ) ? deltaItems : 0;
				this.changeItemsIndexes(direction);	
			}
		},
		/**
		 *	Modify default iScroll options
		 */
		fiddleWithTheOptions: function(){
			var that = this;
			this._iscrollDefaults.onBeforeScrollStart = function (e) { 
				e.preventDefault(); 
				// console.log('scrollStart::');
			};

			this._iscrollDefaults.onScrollMove = function (e) {
				// console.log('currentY', e.screenY)
				that.updateViewLayout(e);
			};

			this._iscrollDefaults.onScrollEnd = function () {
				// console.log('scrollEnd::');
			};
			// this._iscrollDefaults
		},

		changeItemsIndexes: function(direction){
			console.log('Current iScroll index:', -this.iScroll.currentIndex);
			var headBufferIndex = - this.iScroll.currentIndex;
			var tailBufferIndex = - this.iScroll.currentIndex + 
									this.iScroll.maxVisibleItems;
			if (direction === 'down') {
				console.log('remove', headBufferIndex - 1);	
				console.log('append', tailBufferIndex + 1);
			} else if (direction === 'up'){
				console.log('append', headBufferIndex);	
				console.log('remove', tailBufferIndex + 2);
			}

			// this.generateItemsRange(headBufferIndex, tailBufferIndex);
		},

		generateItemsRange: function(start, end){
			for (var i = start; i <= end; i++) {
				console.log('Render BufferCell['+i+']');
			}
		},

		removeItem: function(pos){
			
		},

		appendItem: function(pos){}


	});

	return ScrollView;

});