define([
    'jquery',
    'underscore',
    'backbone',
    './Apps/TasksViewer/Views/tasks_viewer'
], function ($, _, Backbone, TasksViewer) {

    function notify_event_changed(event, action) {
        var tasks = SmartBlocks.Blocks.TaskManagement.Data.tasks.models;

        for (var k in tasks) {
            var task = tasks[k];
            (function (task) {
                var events = task.getEvents();
                var participants = task.get("participants");
                participants.push(task.get("owner"));
                var send = false;
                for (var i in events) {

                    if (events[i].get('id') == event.get('id')) {
                        send = true;
                    }

                }
                if (send) {
                    for (var j in participants) {
                        SmartBlocks.sendWs(participants[j].session_id, {
                            "block": "TaskManagement",
                            "action": action,
                            "task": task,
                            "notifier": SmartBlocks.current_user.get('id')
                        })
                    }
                }
            })(task);
        }
    }


    var main = {
        task_appended_info: [],
        task_main_info: [],
        init: function () {
            var base = this;

            SmartBlocks.events.on("ws_notification", function (message) {
                if (!message.notifier || message.notifier != SmartBlocks.current_user.get('id')) {
                    if (message.block == "TaskManagement") {
                        if (message.action == "saved_task") {
                            var task_array = message.task;

                            var task = SmartBlocks.Blocks.TaskManagement.Data.tasks.get(task_array.id);
                            if (task) {
                                task.fetch();
                            } else {
                                var task = new SmartBlocks.Blocks.TaskManagement.Models.Task(task_array);
                                task.fetch({
                                    success: function () {
                                        SmartBlocks.Blocks.TaskManagement.Data.tasks.add(task);
                                    }
                                });
                            }
                            console.log("updated_task");
                        } else if (message.action == "deleted_task") {
                            var task_array = message.task;
                            SmartBlocks.Blocks.TaskManagement.Data.tasks.remove(task_array.id);
                            console.log('removed task ' + task_array.id, SmartBlocks.Blocks.TaskManagement.Data.tasks.models);
                        }

                    }
                }
            });
            if (SmartBlocks.Blocks.Time.Data.events) {
                SmartBlocks.Blocks.Time.Data.events.on("sync", function (event) {
                    notify_event_changed(event, "saved_task");
                });
                SmartBlocks.Blocks.Time.Data.events.on("add", function (event) {
                    notify_event_changed(event, "saved_task");
                });
                SmartBlocks.Blocks.Time.Data.events.on("remove", function (event) {
                    notify_event_changed(event, "deleted_task");
                });
            }


        },
        addTaskMainInfo: function (func) {
            var base = this;
            base.task_main_info.push(func);
        },
        addTaskInfo: function (func) {
            var base = this;
            base.task_appended_info.push(func);
        },
        launch_viewer: function (app) {
            var base = this;
            var tasks_viewer = new TasksViewer();
            SmartBlocks.Methods.render(tasks_viewer.$el);
            tasks_viewer.init(app);
        }
    };

    return main;
});