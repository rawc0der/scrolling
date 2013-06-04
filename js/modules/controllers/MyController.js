define([
 'underscore', 
 'backbone',
 'widget',
 'views/ListView',
 'models/BufferCellModel',
 'views/ScrollView',

], function(_, Backbone, Widget, ListView, ListViewModel, ScrollView){
	/**
	 * Controller Object responsible for View construction and application event flow
	 * @type {[Object]}
	 */
	var MyController = _.extend( {}, Backbone.Events );
	/**
	 * Define application logic here, by extending the Controller
	 */
	_.extend( MyController, {
		/**
		 * Function called immediately after App Initialize 
		 */
		start: function(){

			console.log('Controller::Start  --> define logic');
			
			// var listViewModel = new ListViewModel();

			// var myList = new ListView({
			// 	max: 10,
			// 	move: true,
			// 	model: listViewModel
			// });

			// myList.renderTo( $('#page_wrapper'), true );
			
			var scrollView = new ScrollView();
			scrollView.renderTo( $('#page_wrapper'), true );

		} // end start

	});

	return MyController;

});