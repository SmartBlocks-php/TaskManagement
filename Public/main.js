define([
    'jquery',
    'underscore',
    'Backbone',
    './Apps/TasksViewer/Views/tasks_viewer'
], function ($, _, Backbone, TasksViewer) {

    var main = {
        init: function () {
            var base = this;
        },
        launch_tasks_viewer: function (app) {
            var base = this;
            var tasks_viewer = new TasksViewer();
            SmartBlocks.Methods.render(tasks_viewer.$el);
            tasks_viewer.init();
        }
    };

    return main;
});