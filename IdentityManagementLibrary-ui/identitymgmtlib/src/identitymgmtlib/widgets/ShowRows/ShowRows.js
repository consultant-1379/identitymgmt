define([
    'jscore/core',
    './ShowRowsView',
    'widgets/SelectBox',
    'i18n!identitymgmtlib/common.json'
], function(core, View, SelectBox, i18n) {
    'use strict';

    return core.Widget.extend({

        view: function() {
            return new View({
                i18n: i18n
            });
        },

        onViewReady: function() {
            this.selectBox = new SelectBox({
                modifiers: [{
                    name: 'width',
                    value: 'mini'
                }],
                value: {
                    name: '50',
                    value: 50
                },
                items: [{
                    name: '10',
                    value: 10
                }, {
                    name: '20',
                    value: 20
                }, {
                    name: '50',
                    value: 50
                }, {
                    name: '100',
                    value: 100
                }, {
                    name: '500',
                    value: 500
                }]
            });

            this.selectBox.attachTo(this.view.getSelectboxContainer());
        },

        configure: function(options) {
            if (options.paginatedTable) {
                this.paginatedTable = options.paginatedTable;
            }

            this.addEventHandlers();
        },

        addEventHandlers: function() {
            this.selectBox.addEventHandler('change', function() {
               this.paginatedTable.setPageSize(this.selectBox.getValue().value);
            }.bind(this));
        },

        setValue: function(value) {
            this.selectBox.setValue({
                name: parseInt(value),
                value: parseInt(value)
            });
        },

         getValue: function(value) {
              return this.selectBox.getValue();
          }

    });

});