define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/tasks_viewer.html'
], function ($, _, Backbone, tasks_viewer_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "tasks_viewer",
        initialize: function () {
            var base = this;
        },
        init: function () {
            var base = this;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(tasks_viewer_tpl, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});