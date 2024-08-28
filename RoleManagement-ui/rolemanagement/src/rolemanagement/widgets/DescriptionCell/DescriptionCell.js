define([
    "tablelib/Cell",
    "./DescriptionCellView",
    '../../Dictionary'
], function (Cell, View, Dictionary) {

    return Cell.extend({

        View: View,

        setValue : function(description) {
                this.view.getDescriptionText().setText(description);
        }

    });

});