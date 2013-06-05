define([
 'underscore',
 'backbone',
 'widget',
 'views/BufferCell',
 'models/BufferCellModel',

], function(_, Backbone, Widget, bufferCell, BufferModel){
	
	var ListViewAdapter = {

		getView: function(idx){
			return bufferCell.el;
		},

		

	}

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
			bounce: false,
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
				console.log('max', self.iScroll.maxCurrentIndex)

				// self.changeItemsIndexes();

				// $('#scroller').find('ul').css({
				// 	height: '600px'
				// });
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
			// return maxIndex;
			return 50;
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
			console.log('max current index', this.iScroll.maxCurrentIndex)
			console.log('current index',this.iScroll.currentIndex)
			console.log('delta',deltaItems)

			console.log('different', this.iScroll.currentIndex !== deltaItems )
			if (   deltaItems < 0
				// && this.iScroll.currentIndex !== deltaItems 
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
			var appendPos, removePos;
			if (direction === 'down') {
				console.log('down');
				console.log('remove', headBufferIndex - 1);
				console.log('append', tailBufferIndex + 1);
				removePos =  headBufferIndex - 1;
				appendPos = tailBufferIndex + 1;
				this.recycleDown(appendPos, removePos);
			} else if (direction === 'up'){
				console.log('up')
				console.log('append', headBufferIndex);	
				console.log('remove', tailBufferIndex + 2);
				appendPos =  headBufferIndex;
				removePos = tailBufferIndex + 2;
				this.recycleUp(removePos, appendPos);
			}
			// this.removeItem(removePos);
			// this.appendItem(appendPos);


			// this.generateItemsRange(headBufferIndex, tailBufferIndex);
		},

		generateItemsRange: function(start, end){
			for (var i = start; i <= end; i++) {
				console.log('Render BufferCell['+i+']');
			}
		},

		recycleUp: function(tPos, hPos){
			this.removeTail(tPos);
			this.appendHead(hPos);
		},

		recycleDown: function(tPos, hPos){
			this.removeHead(tPos);
			this.appendTail(hPos);
		},


		// removeItem: function(pos){
		// 	console.log('removing:', pos)
		// 	var idx = pos - 1;
		// 	this.$el.find('li:eq(0)').remove();
		// },

		// appendItem: function(pos){
		// 	console.log('appending:', pos)
		// 	var view = ListViewAdapter.getView(pos);
		// 	$("ul li:eq("+pos+")").after( view.el );
		// },

		removeHead: function(pos){
			console.log('removeHead:', pos)
			$('ul li:eq(0)').remove();
			var padding = parseInt( $('ul').css('padding').replace('px', '') );
			padding += this.getItemsHeight()
			$('ul').css({
				'padding-top': padding
			})
		},

		removeTail: function(pos){
			console.log('removeTail:', pos)
			$('ul li:last').remove();
			var padding = parseInt( $('ul').css('padding').replace('px', '') );
			padding -= this.getItemsHeight()
			$('ul').css({
				'padding-top': padding
			})
		},

		appendHead: function(pos){
			console.log('appendHead:', pos)
			var view = ListViewAdapter.getView(pos);
			$("ul").prepend( $('<li class="cell"> cell '+pos+' </li>') );
		},

		appendTail: function(pos){
			console.log('appendTail:', pos )
			var view = ListViewAdapter.getView(pos);
			$("ul").append( $('<li class="cell"> cell '+pos+' </li>') );
		}


	});

	return ScrollView;

});