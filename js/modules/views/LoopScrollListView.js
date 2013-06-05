define([
 'underscore',
 'backbone',
 'widget'


], function(_, Backbone, Widget){
	
	var ScrollView = Widget.extend({
		
		template: {
			templateString: '<div id="LoopScrollView">  <div id="wrapper"> </div> </div>'
		},

		subviewsContainer: 'wrapper',

		subviews: [],

		viewOptions: [],

		/*************************Default iScroll options*********************/
		
		/*********************************************************************/

		initialize: function(){
			Widget.prototype.initialize.call(this);
			
		},
		


	});

	return ScrollView;

});