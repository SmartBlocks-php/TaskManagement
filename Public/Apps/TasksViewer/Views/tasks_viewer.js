define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/tasks_viewer.html',
    '../../Common/Views/task',
    'jqueryui'
], function ($, _, Backbone, tasks_viewer_tpl, TaskView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "tasks_viewer",
        initialize: function () {
            var base = this;
        },
        init: function (app) {
            var base = this;
            base.app = app;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(tasks_viewer_tpl, {});
            base.$el.html(template);

            base.renderTasks();
            base.$el.find(".tasks_list").droppable({
                accept: ".task",
                hoverClass: "element_over",
                drop: function (event, ui) {
                    var task = SmartBlocks.Blocks.TaskManagement.Data.tasks.get(ui.draggable.attr('data-id'));
                    var event = new SmartBlocks.Blocks.Time.Models.Event();
                    event.set("name", task.get('name'));
                    event.set("description", "A task to do");
                    var now = new Date();
                    var end = new Date(now);
                    end.setHours(end.getHours() + 1);
                    event.setStart(now);
                    event.setEnd(end);
                    event.set("all_day", true);
                    SmartBlocks.Blocks.Time.Data.events.add(event);
                    event.save({}, {
                        success: function () {
                            task.addEvent(event);
                            base.renderTasks();
                        }
                    });

                }
            });
        },
        renderTasks: function () {
            var base = this;
            var tasks = SmartBlocks.Blocks.TaskManagement.Data.tasks;
            base.$el.find(".tasks_list").html("");
            for (var k in tasks.models) {
                var task = tasks.models[k];
                base.renderTask(task);
            }
        },
        renderTask: function (task) {
            var base = this;
            var events = task.getEvents();
            var now = new Date();
            if (events.length > 0) {
                for (var j in events) {
                    if (events[j]) {
                        var start = events[j].getStart();
                        var day = start.getDate();
                        var month = start.getMonth();
                        var year = start.getFullYear();
                        if (now.getDate() == day && now.getMonth() == month && now.getFullYear() == year) {
                            var task_view = new TaskView({model: task});
                            base.$el.find(".today_tasks").append(task_view.$el);
                            task_view.init();
                        } else if (now.getDate() == day + 1 && now.getMonth() == month && now.getFullYear() == year) {
                            var task_view = new TaskView({model: task});
                            base.$el.find(".tomorrow_tasks").append(task_view.$el);
                            task_view.init();
                        } else if (now < start) {
                            var task_view = new TaskView({model: task});
                            base.$el.find(".later_tasks").append(task_view.$el);
                            task_view.init();
                        }
                    }

                }
            }
            var task_view = new TaskView({model: task});
            base.$el.find(".unplanned_tasks").append(task_view.$el);
            task_view.init();
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".add_task_button", "click", function () {
                var name = base.$el.find(".task_name").val();
                if (name != "") {
                    var task = new SmartBlocks.Blocks.TaskManagement.Models.Task();
                    task.set("name", name);
                    task.save();
                    SmartBlocks.Blocks.TaskManagement.Data.tasks.add(task);

                }

            });

            SmartBlocks.Blocks.TaskManagement.Data.tasks.on("add", function (task) {
                base.renderTask(task);
            });


        }
    });

    return View;
});