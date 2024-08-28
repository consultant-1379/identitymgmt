define([
    "tablelib/Cell",
    "./BasicFilterHeaderCellView",
], function (Cell, View) {

    return Cell.extend({

        View: View,

        eventTimeout: 500,
        lastEvent : new Date(),
        date: new Date(),
        attr: null,
        val: null,
        waiting: false,

        onViewReady: function() {
            this.input = this.getElement().find("input");
            this.input.addEventHandler("input", _sendFilterEvent.bind(this));
        },

        setValue: function() {
            // We don't want the default implementation to override our template
        }

    });

    function _sendFilterEvent() {
        this.attr = this.getColumnDefinition().attribute;
        this.val = this.input.getValue();
        var toWait = this.eventTimeout - (this.date.getTime() - this.lastEvent);
        if (toWait <= 0){
            this.getTable().trigger("filter", this.attr, this.val);
            this.lastEvent = this.date.getTime();
        }else if(!this.waiting){
            setTimeout(function(){
                this.getTable().trigger("filter", this.attr, this.val);
                this.lastEvent = this.date.getTime();
                this.waiting = false;
            }.bind(this),toWait);
            this.waiting = true;
        }
    }
});

