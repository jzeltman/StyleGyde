_.templateSettings = {
	interpolate : /\{\{(.+?)\}\}/g
};

var Item_Model = Backbone.Model.extend({
	defaults : {
		title	      : "title",
		html        : "<h1>html</h1>",
		description : "description",
		img         : "/path/to/img"
	}
});

var CSS_Model = Backbone.Model.extend({
	defaults : {
		css : ""
	}
});

var JS_Model = Backbone.Model.extend({
	defaults : {
		js : ""
	}
});

var Login_View = Backbone.View.extend({
	el : "#offscreen-top",
	tmpl : _.template($("#login-tmpl").html()),
	initialize : function() {
		this.render();
	},
	render : function() {
		$(this.el).html(this.tmpl)
		return this;
	},
	cleanup : function() {
		$(this.el).contents().remove();
		$(this).contents().unbind();
	}
});

var Item_View = Backbone.View.extend({
	className : "sg-item clearfix",
	tmpl : _.template($("#item-tmpl").html()),
	initialize : function() {
		_.bindAll(this, 'render');
		this.model.bind('change', this.render);
	},
	render : function() {
		$(this.el).html(this.tmpl(this.model.toJSON()));
		// Not for production, but in offline, it's the only way to preview
		$(this.el).find(".sg-html").html(this.model.get("html"));
		// For production, but will throw an error when used offline
		//$(this.el).find(".sg-html-iframe").contents().find("#render").html(this.model.get("html"));
		
		return this; 
	},
	cleanup : function() {
		$(this.el).contents().remove();
		$(this).contents().unbind();
	},
	events : {
		"click .icon-cogs" : "debug",
		"dblclick h1.sg-title" : "edit_title",
		"keypress input[name=sg-title]" : "update_title",
		"blur input[name=sg-title]" : "update_title",
		"click .sg-description-container .icon-edit" : "edit_description",
		"dblclick .sg-description" : "edit_description",
		"click .sg-description-container .icon-ok" : "update_description",
		"blur .sg-description-input" : "update_description",
		"click .sg-html-container .icon-edit" : "edit_html",
		"dblclick .sg-html" : "edit_html",
		"click .sg-html-container .icon-ok" : "update_html",
		"blur .sg-html-input" : "update_html"
	},
	debug : function() {
		console.log("Model: ", this.model)
	},
	
	edit_title : function(e) {
		$(this.el).find(".sg-title").toggle();
		$(this.el).find("input[name=sg-title]").toggle().focus();
	},
	
	update_title : function(e) {
		if ( e.keyCode == 13 || e.type == "focusout" ) {
		
			var title_val = $(this.el).find("input[name=sg-title]").val();
		
			if ( this.model.get("title") == title_val ) {
				$(this.el).find(".sg-title").toggle();
				$(this.el).find("input[name=sg-title]").toggle()
			} else {
				this.model.set({title : title_val});
			}
		}
	},
	
	edit_description : function() {
		$(this.el).find(".sg-description-container .icon-edit").toggle();
		$(this.el).find(".sg-description-container .icon-ok").toggle();
		$(this.el).find(".sg-description").toggle();
		$(this.el).find(".sg-description-input").toggle().focus();
	},
	
	update_description : function(e) {	
		if ( e.type == "focusout" || e.type == "click" ) {
		
			var description_val = $(this.el).find(".sg-description-input").val();
		
			if ( this.model.get("description") == description_val ) {
				$(this.el).find(".sg-description-container .icon-edit").toggle();
				$(this.el).find(".sg-description-container .icon-ok").toggle();
				$(this.el).find(".sg-description").toggle();
				$(this.el).find(".sg-description-input").toggle();
			} else {
				this.model.set({description : description_val});
			}
		}
	},
	
	edit_html : function() {
		$(this.el).toggleClass("edit-html");
		$(this.el).find(".sg-html-container .icon-edit").toggle();
		$(this.el).find(".sg-html-container .icon-ok").toggle();
		$(this.el).find(".sg-html").toggle();
		$(this.el).find(".sg-html-input").toggle().focus();
	},
	
	update_html : function(e) {	
		if ( e.type == "focusout" || e.type == "click" ) {
		
			var html_val = $(this.el).find(".sg-html-input").val();
		
			if ( this.model.get("html") == html_val ) {
				$(this.el).toggleClass("edit-html");
				$(this.el).find(".sg-html-container .icon-edit").toggle();
				$(this.el).find(".sg-html-container .icon-ok").toggle();
				$(this.el).find(".sg-html").toggle();
				$(this.el).find(".sg-html-input").toggle();
			} else {
				this.model.set({html : html_val});
			}
		}
	}
	
});

var CSS_View = Backbone.View.extend({
	el : "#offscreen-left",
	className : "clearfix",
	tmpl : _.template($("#css-tmpl").html()),
	initialize : function() {
		this.render();
	},
	render : function() {
		$(this.el).html(this.tmpl(this.model.toJSON()));
		$(this.el).find("textarea").focus;
		$(this.el).slideToggle();
		return this; 
	},
	cleanup : function() {
		$(this.el).contents().remove();
		$(this).contents().unbind();
	},
	events : {
		"blur textarea" : "update_css"
	},
	
	update_css : function(e) {
		if ( e.type == "focusout" || e.type == "click" ) {
			var css_val = $(this.el).find("textarea").val();
			this.model.set({html : css_val});
		}
	}
});


var App_MNGR = Backbone.View.extend({
	el : "#menu",
	className : "clearfix",
	tmpl : _.template($("#menu-tmpl").html()),
	initialize : function() {
		this.render();
	},
	render : function() {
		$(this.el).html(this.tmpl);
		return this; 
	},
	cleanup : function() {
		$(this.el).contents().remove();
		$(this).contents().unbind();
	},
	events : {
		"click #add-new" : "add_new_item",
		"click #settings" : "toggle_css"
	},
	
	add_new_item : function() {
		var view = new Item_View({model : new Item_Model});
    $("#app-items").append(view.render().el);
	},
	
	toggle_css : function() {
		new CSS_View({model : App.CSS});
	}
	
});

var App = {};
		App.CSS = new CSS_Model;
		App.JS = new JS_Model;

$(function(){
	new App_MNGR;
});