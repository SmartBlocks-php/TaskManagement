define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task.html',
    'jqueryui'
], function ($, _, Backbone, task_template) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task",
        initialize: function (obj) {
            var base = this;
            base.task = obj.model;
        },
        init: function () {
            var base = this;
            base.render();
            base.$el.draggable({
                revert: true
            });
            base.$el.attr("data-id", base.task.get('id'));
        },
        render: function () {
            var base = this;

            var template = _.template(task_template, {
                task: base.task
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.task.on("destroy", function () {
                base.$el.slideUp(200, function () {
                    base.$el.remove();
                });
            });

            SmartBlocks.Blocks.TaskManagement.Data.tasks.on("change", function () {
                base.render();
            });
        }
    });

    return View;
});