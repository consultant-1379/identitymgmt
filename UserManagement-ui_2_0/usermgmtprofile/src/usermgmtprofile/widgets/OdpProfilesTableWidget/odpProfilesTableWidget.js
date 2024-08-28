/*******************************************************************************
 * COPYRIGHT Ericsson 2016
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************/

define([
    'jscore/core',
    'jscore/ext/privateStore',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/SmartTooltips',
    'tablelib/plugins/StickyScrollbar',
    'uit!./odpProfilesTableWidget.html',
    'usermgmtlib/cells/ProfileNamesComboCell',
    'identitymgmtlib/Utils',
    'i18n!identitymgmtlib/common.json',
    'usermgmtlib/Dictionary',
    'i18n/number'
], function(core, PrivateStore, ResizableHeader, SmartTooltips, StickyScrollbar, View, ProfileNamesComboCell,  Utils,
            IdentityDictionary, Dictionary, i18nNumber) {

    var _ = PrivateStore.create();

    return core.Widget.extend({
        init: function(options) {
            _(this).model = options.model;
            _(this).odpProfiles = options.odpProfiles;
        },

        view: function() {
            return new View({
                tableHeaders: IdentityDictionary.odpTable,
                searchPlaceholder: Dictionary.odpTable.searchPlaceholder,
                infoPopup: {
                    content: Dictionary.odpTable.infoPopup
                },
                tableOptions: {
                    modifiers: [{
                        name: 'striped'
                    }],
                    plugins: [
                        new SmartTooltips(),
                        new StickyScrollbar(),
                        new ResizableHeader()
                    ],

                    columns: [ {
                        title: IdentityDictionary.odpTable.columns.name,
                        attribute: 'applicationName',
                        width: '350px',
                        resizable: true,
                        sortable: true,
                        filter: {
                            type: 'text',
                            options: {
                                submitOn: 'input',
                                placeholder: Dictionary.filterPlaceHolder
                            }
                        }
                    }, {
                        title: IdentityDictionary.odpTable.columns.profile,
                        attribute: 'profile',
                        cellType: ProfileNamesComboCell,
                        width: '500px',
                        resizable: true,
                        sortable: true,
                        filter: {
                            type: 'text',
                            options: {
                                submitOn: 'input',
                                placeholder: Dictionary.filterPlaceHolder
                            }
                        }
                    }]
                }
            });
        },

        onViewReady: function() {
            var odpValues = [];
            var odpProfilesValues = _(this).model.get('odpProfiles');
            if ( odpProfilesValues && odpProfilesValues.length > 0 ) {
                odpProfilesValues.forEach(function (item) {
                    odpValues[item.applicationName.toLowerCase()] = item.profileName.toLowerCase();
                });
            }

            var data = [];
            _(this).odpProfiles.forEach(function (odpProfile) {
                var dataItem = {};
                dataItem.applicationName = odpProfile.applicationName;

                dataItem.profile = {};
                dataItem.profile.items = odpProfile.profiles;
                dataItem.profile.name = odpValues[odpProfile.applicationName.toLowerCase()];

                data.push(dataItem);
            });

            var allNumber = this.view.getElement().find('.eaUsermgmtprofile-wOdpProfilesTableWidget-resultsOdp-all');
            allNumber.setText(Utils.printf(Dictionary.odpTable.odpProfiles2, i18nNumber(_(this).odpProfiles.length).format('0,0')));

            this.view.findById('odpProfilesTable').addEventHandler("changed", function() {
                this.updateModelData();
            }.bind(this));
            this.view.findById('odpProfilesTable').setData(data);
        },

        updateModelData: function() {
            var data = this.view.findById('odpProfilesTable').getData();
            var modelData = [];

            data.forEach(function (item) {
                var modelDataItem = {};
                modelDataItem.applicationName =  item.applicationName.toLowerCase();
                modelDataItem.profileName =  item.profile.name;

                // Skip default value --> item.profile.value === 1
                if ( item.profile.value !== 1 ) {
                    modelData.push(modelDataItem);
                }
            });
            _(this).model.set('odpProfiles', modelData);
        }
    });
});
