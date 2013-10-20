define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/event.html'
], function ($, _, Backbone, event_template) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "event_viewer",
        initialize: function (obj) {
            var base = this;
            base.event = obj.model;
        },
        init: function () {
            var base = this;

            base.render();
            base.registerEvents();

            base.$el.draggable({
                revert: true
            });
        },
        render: function () {
            var base = this;
            base.$el.attr("data-id", base.event.get('id'));
            base.$el.attr('data-index', SmartBlocks.Blocks.Time.Data.events.models.indexOf(base.event));
            var template = _.template(event_template, {
                event: base.event,
                start : base.event.getStart(),
                end: base.event.getEnd()
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;

            base.event.on("destroy", function () {
                base.$el.slideUp(200, function () {
                    base.$el.remove();
                });
            });
        }
    });

    return View;
});