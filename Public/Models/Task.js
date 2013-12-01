define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        default: {
            description: ""
        },
        urlRoot: "/TaskManagement/Task",
        getEvents: function () {
            var base = this;
            var events = [];
            if (SmartBlocks.Blocks.Time) {
                events = SmartBlocks.Blocks.Time.Data.events.filter(function (event) {
                    return event.get('task_id') == base.get('id');
                });
            }

            return events;
        },
        addEvent: function (event) {
            var base = this;
            if (!base.get("events")) {
                base.set("events", []);
            }
            base.get("events").push(event.get("id"));
        },
        removeEvent: function (event) {
            var base = this;
            if (!base.get("events")) {
                base.set("events", []);
            }
            var index = base.get("events").indexOf(event.get("id"));
            if (index !== -1) {
                delete base.get("events")[index];
            }
        },
        getDuration: function (start, end) {
            var base = this;
            var events = base.getEvents();
            var duration = 0;
            for (var k in events) {
                var event = events[k];
                duration += event.getDuration(start, end);

            }
            return duration;
        },
        getDoneDuration: function (start, end) {
            var base = this;
            var events = base.getEvents();
            var duration = 0;
            for (var k in events) {
                var event = events[k];
                duration += event.getDoneDuration(start, end);
            }
            return duration;
        },
        getLeftDuration: function (start, end) {
            var base = this;
            var events = base.getEvents();
            var duration = 0;
            for (var k in events) {
                var event = events[k];
                duration += event.getLeftDuration(start, end);
            }
            return duration;
        }
    });
    return Model;
});