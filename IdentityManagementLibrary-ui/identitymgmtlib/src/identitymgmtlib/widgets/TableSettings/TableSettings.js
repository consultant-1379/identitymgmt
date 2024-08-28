define([
    'jscore/core',
    'container/api',
    'tablelib/TableSettings',
    '../table-settings-form/TableSettingsForm',
    './TableSettingsView',
    'i18n!identitymgmtlib/common.json'
], function (core,container, TableSettings, TableSettingsForm, View, dictionary) {
    'use strict';

    return core.Widget.extend({

        view: function () {
            return new View({
                settings: dictionary.get('tableSettings')
            });
        },

        onViewReady: function () {
            this.view.getTableSettingsBtn().addEventHandler('click', this.onTableSettings.bind(this));
            this.columns = JSON.parse(sessionStorage.getItem("userManagementTableSettingColumns"));
            this.tableSettings = new TableSettings({
                                        selectDeselectAll: {
                                        labels: dictionary.get('columnSelectionLabels')
                                    },
                                    columns: (this.columns === null ? this.options.columns : this.columns),
                                    showPins: false
                                   });
        },


        onTableSettings: function () {
            if (this.settingsForm === undefined) {

                this.settingsForm = new TableSettingsForm({
                    content: this.tableSettings
                });

                this.settingsForm.addEventHandler('apply', function () {
                    container.getEventBus().publish('flyout:hide');
                    this.onTableSettingsChange();
                }.bind(this));

                this.settingsForm.addEventHandler('cancel', function () {
                     container.getEventBus().publish('flyout:hide');
                }.bind(this));
            }


             container.getEventBus().publish('flyout:show', {
                 header: dictionary.get('tableSettings'),
                 content: this.settingsForm
             });


        },

        onTableSettingsChange: function () {
         sessionStorage.setItem("userManagementTableSettingColumns", JSON.stringify(this.tableSettings.columns));
         this.trigger('table-settings:change');
        },


        getUpdatedColumns: function(){
          return this.tableSettings.getUpdatedColumns();
        }


    });



});
