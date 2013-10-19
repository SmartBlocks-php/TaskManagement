define([
    'jquery',
    'underscore',
    'backbone',
    '../Models/Task'
], function ($, _, Backbone, Task) {
    var Collection = Backbone.Collection.extend({
        model: Task,
        url: "/TaskManagement/Tasks"
    });

    return Collection;
});