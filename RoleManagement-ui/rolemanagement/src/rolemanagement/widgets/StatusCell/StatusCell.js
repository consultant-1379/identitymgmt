define([
    "tablelib/Cell",
    "./StatusCellView",
    '../../Dictionary'
], function (Cell, View, Dictionary) {

    return Cell.extend({

        View: View,

        setValue : function(status) {
            switch (status) {
            case Dictionary.statusCell.RoleStatusEnabled:
                this.view.getStatusIcon().setModifier('simpleGreenTick');
                break;
            case Dictionary.statusCell.RoleStatusDisabled:
                this.view.getStatusIcon().setModifier('close', 'red');
                break;
            case Dictionary.statusCell.RoleStatusNonassignable:
                break;
            }
            this.view.getStatusText().setText(status);

        }

    });

});