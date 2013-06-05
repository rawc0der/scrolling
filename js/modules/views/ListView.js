define([
 'underscore',
 'backbone',
 'widget',
 'views/BufferCell'

], function(_, Backbone, Widget, bufferCell){
	

	
	var ListView = Widget.extend({
		
		template: {
			templateString: '<div id="ListView"> <h4>ListView Demo</h4> <ul class="ListContainer">    </ul> </div>'
		},

		subviewsContainer: '.ListContainer',

		subviews: [],

		viewOptions: ['max', 'move'],

		bufferCell: bufferCell,

		currentY: 0,

		max: 5,

		move: false,

		currentScrollIndex: 0,

		events: {
			'mousedown .ListContainer': 'handleMouseDown',
		},

		initialize: function(){

			Widget.prototype.initialize.call(this);
			///////////////////////// Styling //////////////////////////////

			this.$el.css({
				border: '1px solid gray',
				width: '300px'
			}) // el container
			this.$el.find('.ListContainer').css({
				height: '220px',
				overflow: 'hidden'
			});
			this.$el.find('h4').css({
				'text-align': 'center',
				'color': 'purple',
				'border-bottom': '2px dotted gray'
			})  // title container

			///////////////// End Styling /////////////////////////////////
			
			this.initializeContainer();	

			console.log(this)
		},

		initializeContainer: function(){
			var self = this;
			for (var i = 0; i < 10; i++ ){
				var cell = new Widget({
					template: {
						templateString: '<li class="cell" > <%= content %> </li>',
						templateDataObject: {
							content: self.model.get('viewData')[i].name,
						}
					},
					initialize: function(){
						this.$el.css({
							height:'20px',
							'line-height': '20px',
							border: '1px dotted purple'
						}); // el container
					}
				})
				this.addSubview( cell );
			}
			this.renderSubviews();
		},

		handleMouseDown: function(evt){
			this.initialY = evt.screenY;
			this.currentY = evt.screenY;
			this.bindScrolling(this.currentY);
			var self = this;
			this.$el.find('.ListContainer').on({
				'mouseup': function(evt){	self.unbindScrolling();	},
				'mouseleave': function(evt){	self.unbindScrolling();	},
			});
		},

		bindScrolling: function(currentY){
			var self = this;
			this.$el.find('.ListContainer').on('mousemove', function(evt){
				// console.log(evt)
				var toY = evt.screenY;
				self.handleMove( toY );
			})
		},

		unbindScrolling: function(){
			this.$el.find('.ListContainer').off('mousemove');
		},

		setBufferData: function(data){
			this.bufferCell.setTemplate({
				content: data
			});
		},

		appendBufferCell: function(){
			this.addSubview( this.bufferCell );
			this.renderSubviews();
		},

		prependBufferCell: function(){
			this._subviews.unshift( this.bufferCell );
			this.renderSubviews();
		},

		swapHeadBufferCell: function(){
			this.removeSubview(0);
			this.appendBufferCell();
		},

		swapTailBufferCell: function(){
			this.removeSubview( this._subviews.length - 1 );
			this.prependBufferCell();
		},

		// refreshIndexes: function(){},

		updateIndex: function(index){
			// if ( this.currentScrollIndex == 0 && index == 1 ) {
			// 	console.log('cant move up');
			// } else if ( this.currentScrollIndex != 14 ) {
			// 	this.currentScrollIndex -= index;
			// 	console.log('moving to', this.currentScrollIndex)
			// } else if ( this.currentScrollIndex == 14 && index == 1) {
			// 	this.currentScrollIndex += index;
			// 	console.log('moving from last', this.currentScrollIndex)
			// } else {
			// 	console.log('cant move down')
			// }
		},

		handleScrollUp: function(){
			this.updateIndex(1);
			this.moveContainerUp();
		},

		handleScrollDown: function(){
			this.updateIndex(-1);
			this.moveContainerDown();
		},

		handleMove: function(offsetY){
			var offset = this.currentY - offsetY;
			this.currentY = offsetY;
			var moved = this.initialY - this.currentY;
			this.refreshList(moved);

		},

		refreshList: function(moved){
			// console.log(moved)
			if ( (moved % 20) == 0 ) {
				if ( (this.initialY - this.currentY)  > 0 ) {
					this.handleScrollUp();
				} else if ( (this.initialY - this.currentY)  < 0 ) {
					this.handleScrollDown();
				}
				this.initialY = this.currentY;
			}
		},

		moveContainerUp: function(){
			console.log('MOVE UP')
		},

		moveContainerDown: function(){
			console.log('MOVE DOWN')
		},

		/**
		 *  Extend Backbone View with custom attributes
		 */

	});

	return ListView;

});