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
            base.$el.attr("data-id", base.task.get('id'));
            base.$el.attr('data-index', SmartBlocks.Blocks.TaskManagement.Data.tasks.models.indexOf(base.task));

            base.render();

            base.$el.draggable({
                revert: true
            });
            base.registerEvents();

        },
        render: function () {
            var base = this;
            base.$el.attr("data-id", base.task.get('id'));
            base.$el.attr('data-index', SmartBlocks.Blocks.TaskManagement.Data.tasks.models.indexOf(base.task));
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

            base.task.on("change", function () {
                base.render();
            });

            base.$el.delegate(".tick", 'click', function () {
                var elt = $(this);

                elt.toggleClass('checked');

                base.task.set("done", elt.hasClass('checked'));
                base.task.save();
            });

            base.$el.delegate('.delete_button', 'click', function () {
                var elt = $(this);
                if (confirm('Are you certain you want to delete this task and its events ?')) {

                    var events = base.task.getEvents();
                    for (var k in events) {
                        events[k].destroy();
                        console.log("yup");
                    }

                    base.task.destroy();
                    base.$el.slideUp(200, function () {
                        base.$el.remove();
                    });
                }
            });
        }
    });

    return View;
});