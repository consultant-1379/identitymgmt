define([
    "tablelib/Cell",
    'uit!./resultsTableCell.html',
], function(Cell, View) {

    return Cell.extend({

        View: View,

        setValue: function(model) {
            this.model = model;
            if (this.model.success) {
                this.getElement().find('.eaUsermgmtlib-ResultsTableCell-icon').setModifier("tick");
            } else {
                this.getElement().find('.eaUsermgmtlib-ResultsTableCell-icon').setModifier("error");
            }
            this.getElement().find('.eaUsermgmtlib-ResultsTableCell-text').setText(this.model.message);
        },
        
        setTooltip: function(model) {
            this.getElement().setAttribute("title", model.message);
        }
    });

});
