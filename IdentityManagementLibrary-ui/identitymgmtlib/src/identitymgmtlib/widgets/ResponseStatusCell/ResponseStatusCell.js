define([
    "tablelib/Cell",
    "./ResponseStatusCellView"
], function (Cell, View) {

    return Cell.extend({

        View: View,

        setValue : function(model) {
            if(model.success) {
                this.view.getStatusIcon().setModifier("tick");
            } else {
                this.view.getStatusIcon().setModifier("error");
            }
            this.view.getStatusText().setText(model.message);
        }

    });

});