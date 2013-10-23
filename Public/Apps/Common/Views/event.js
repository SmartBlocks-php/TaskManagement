define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/event.html',
    'ContextMenuView'
], function ($, _, Backbone, event_template, ContextMenu) {
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

            base.$el.attr("oncontextmenu", "return false;");
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

            base.$el.mouseup(function (e) {
                if (e.which == 3) {
                    var context_menu = new ContextMenu();
                    context_menu.addButton("See calendar", function () {
                        window.location = "#calendar";
                    });
                    context_menu.addButton("Delete event", function () {
                        base.event.destroy();
                    });
                    context_menu.show(e);
                }
            });
        }
    });

    return View;
});