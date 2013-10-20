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
                if (base.get("events")) {
                    var event_ids = base.get("events");
                    for (var k in event_ids) {
                        var event = SmartBlocks.Blocks.Time.Data.events.get(event_ids[k]);
                        if (event) {
                            events.push(event);
                        }

                    }
                }
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
        }
    });
    return Model;
});