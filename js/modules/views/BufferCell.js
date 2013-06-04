define([
 'underscore',
 'backbone',
 'widget',
 'models/BufferCellModel',


], function(_, Backbone, Widget, BufferModel){
	
	var BufferCell = new Widget({
		template: {
			templateString: '<li class="cell"> <%= content %> </li>',
			templateDataObject: {
				content: 'Buffer Cell'
			}
		},
		model: new BufferModel(),
		initialize: function(){
			console.log('initialized buffer cell', this);
		}

	});

	return BufferCell;

});