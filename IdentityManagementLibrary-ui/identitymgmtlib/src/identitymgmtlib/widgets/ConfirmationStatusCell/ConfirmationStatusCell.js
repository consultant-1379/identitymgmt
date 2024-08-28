define([
    "tablelib/Cell",
    "./ConfirmationStatusCellView"
], function (Cell, View) {

    return Cell.extend({

        View: View,

        setValue : function(message) {
            this.view.getStatusText().setText(message);
        }

    });

});