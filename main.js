/**
 * Configure application modules paths
 */
require.config({
	baseUrl: 'js',
	paths: {
		jquery: 'library/min/jquery',
	    underscore: 'library/min/underscore',
	    backbone: 'library/min/backbone',
	    templates: 'modules/templates',
	    controllers: 'modules/controllers',
	    models: 'modules/models',
	    views: 'modules/views',
	    modules: 'modules',
	    widget: 'modules/views/widget-0.7',
	    // transit: 'library/min/jquery.transit.min',
	    iscroll: '../iscroll-lite',
	    soyutils: 'library/googleClosure/soyutils'
	}
});
/**
 * Load main App module
 */
require([
	'app',
	'soyutils'
	

], function(App, tansit){ 
	/**
	 *  Initialize application when DOM finishes loading
	 */
	$(function(){

		window.App = App.initialize();

	});

});