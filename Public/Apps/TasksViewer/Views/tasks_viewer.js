define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/tasks_viewer.html',
    '../../Common/Views/task',
    '../../Common/Views/event',
    'jqueryui'
], function ($, _, Backbone, tasks_viewer_tpl, TaskView, EventView) {
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
            base.$el.find(".events_list").droppable({
                accept: ".task, .event_viewer",
                hoverClass: "element_over",
                drop: function (event, ui) {
                    var recipient = $(this);
                    if (ui.draggable.hasClass("task")) {

                        var task = SmartBlocks.Blocks.TaskManagement.Data.tasks.get(ui.draggable.attr('data-id'));
                        if (!task) {
                            task = SmartBlocks.Blocks.TaskManagement.Data.tasks.models[ui.draggable.attr('data-index')];
                        }
                        if (!task) {
                            console.log('could not find task');
                            return;
                        }
                        var event = new SmartBlocks.Blocks.Time.Models.Event();
                        event.set("name", task.get('name'));
                        event.set("description", "A task to do");
                        event.set('task_id', task.get('id'));

                        var now = new Date();
                        if (recipient.hasClass("tomorrow_events")) {
                            now.setDate(now.getDate() + 1);
                        }
                        if (recipient.hasClass("later_events")) {
                            now.setDate(now.getDate() + 2);
                        }

                        var end = new Date(now);
                        end.setHours(end.getHours() + 1);
                        event.setStart(now);
                        event.setEnd(end);
                        event.set("all_day", true);
                        SmartBlocks.Blocks.Time.Data.events.add(event);
                        event.save({}, {
                            success: function (event) {
                                console.log(event);
                                task.addEvent(event);
                                task.save({}, {
                                    success: function () {
                                        base.renderTasks();
                                    }
                                });

                            }
                        });
                    }
                    if (ui.draggable.hasClass('event_viewer')) {
                        var event = SmartBlocks.Blocks.Time.Data.events.get(ui.draggable.attr('data-id'));
                        if (!event) {
                            event = SmartBlocks.Blocks.Time.Data.events.models[ui.draggable.attr('data-index')];
                        }

                        var now = new Date();
                        if (event) {
                            if (recipient.hasClass("today_events")) {
                                var date = event.getStart();
                                date.setDate(now.getDate());
                                var end = event.getEnd();
                                end.setDate(now.getDate());
                                event.setStart(date);
                                event.setEnd(end);
                            }
                            if (recipient.hasClass("tomorrow_events")) {
                                var date = event.getStart();
                                date.setDate(now.getDate() + 1);
                                var end = event.getEnd();
                                end.setDate(now.getDate() + 1);
                                event.setStart(date);
                                event.setEnd(end);
                            }
                            if (recipient.hasClass("later_events")) {
                                var date = event.getStart();
                                date.setDate(now.getDate() + 2);
                                var end = event.getEnd();
                                end.setDate(now.getDate() + 2);
                                event.setStart(date);
                                event.setEnd(end);
                            }
                            event.set("all_day", true);
                            event.save();
                        }
                    }


                }
            });
        },
        renderTasks: function () {
            var base = this;
            var tasks = new SmartBlocks.Blocks.TaskManagement.Collections.Tasks(SmartBlocks.Blocks.TaskManagement.Data.tasks.filter(function (task) {
                return !task.get("archived") || base.$el.find(".show_archived").hasClass("checked");
            }));
            base.$el.find(".events_list").html("");
            base.$el.find(".tasks_list").html("");

            for (var k in tasks.models) {
                var task = tasks.models[k];
                base.renderTask(task);
            }

            var events = SmartBlocks.Blocks.Time.Data.events;
            var now = new Date();

            if (events.models.length > 0) {
                for (var j in events.models) {
                    if (events.models[j]) {
                        var event = events.models[j];
                        var start = event.getStart();
                        var day = start.getDate();
                        var month = start.getMonth();
                        var year = start.getFullYear();
                        if (now.getDate() == day && now.getMonth() == month && now.getFullYear() == year) {
                            var task_view = new EventView({model: event});
                            base.$el.find(".today_events").append(task_view.$el);
                            task_view.init();
                        } else if (now.getDate() + 1 == day && now.getMonth() == month && now.getFullYear() == year) {
                            var task_view = new EventView({model: event});
                            base.$el.find(".tomorrow_events").append(task_view.$el);
                            task_view.init();
                        } else if (now < start) {
                            var task_view = new EventView({model: event});
                            base.$el.find(".later_events").append(task_view.$el);
                            task_view.init();
                        }
                    }

                }
            }


        },
        renderTask: function (task) {
            var base = this;

            var task_view = new TaskView({model: task});
            base.$el.find(".tasks_list").append(task_view.$el);
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
                base.$el.find(".task_name").val("");
            });

            base.$el.delegate(".show_archived_container", 'click', function () {
                var elt = $(this).find(".show_archived");
                elt.toggleClass("checked");

                if (elt.hasClass("checked")) {
                    elt.addClass("fa-check-square");
                    elt.removeClass("fa-square-o");
                } else {
                    elt.removeClass("fa-check-square");
                    elt.addClass("fa-square-o");
                }

                base.renderTasks();
            });

            base.$el.delegate(".task_name", "keyup", function (e) {
                if (e.keyCode == 13) {
                    var name = base.$el.find(".task_name").val();
                    if (name != "") {
                        var task = new SmartBlocks.Blocks.TaskManagement.Models.Task();
                        task.set("name", name);
                        task.save();
                        SmartBlocks.Blocks.TaskManagement.Data.tasks.add(task);
                    }
                    base.$el.find(".task_name").val("");
                }


            });

            SmartBlocks.Blocks.TaskManagement.Data.tasks.on("add", function (task) {
                base.renderTask(task);
            });

            SmartBlocks.Blocks.Time.Data.events.on("change", function () {
                base.renderTasks();
            });

            SmartBlocks.Blocks.TaskManagement.Data.tasks.on("change", function () {
                base.renderTasks();
            });

        }
    });

    return View;
});