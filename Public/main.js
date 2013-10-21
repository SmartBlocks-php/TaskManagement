define([
    'jquery',
    'underscore',
    'backbone',
    './Apps/TasksViewer/Views/tasks_viewer'
], function ($, _, Backbone, TasksViewer) {



    var main = {
        task_appended_info: [],
        task_main_info:[],
        init: function () {
            var base = this;
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