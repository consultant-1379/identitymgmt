define([
    'jscore/core',
    'container/api',
    'uit!./listTgsFlyoutContent.html',
    'usermgmtlib/Dictionary',
    "widgets/Button",
    "tablelib/Table",
    "identitymgmtlib/Utils"
], function(core, apiContainer, View, Dictionary,  Button, Table, Utils) {

    return core.Widget.extend({

        tgsTable: null,

        view: function() {
            return new View({data: this.options.args, Dictionary: Dictionary});
        },

        onViewReady: function() {
            this.createTable();
            this.tgsTable.attachTo(this.view.getElement().find(".eaUsermanagement-ListTgsFlyoutContent-table-container"));
        },

        createTable: function() {
            this.tgsTable  = new Table({
                modifiers: [
                     {name: 'striped'}
                ],
                columns: this.options.columns,
                data: this.options.data
            });
        }

    });
});
