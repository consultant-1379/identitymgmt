/*
 The SelectAll widget allows the user to select all or clear all rows in the table.
 Events :
 selectAllLink - Triggered when all rows in table are selected by user input
 clearAllLink - Triggered when all rows in table are unselected by user input

 The following options are mandatory : collectionSize, selectedRows, paginationTotalPages, allRowsSelectedOnCurrentPage

 The following options are accepted:
 label (Optional): a string used to set the notification text.
 icon (Optional): a string used to define an icon to show.
 selectAll (Optional): a string used to define the selectAll link text.
 clearAll (Optional): a string used to define the clearAll link text.
 */

define([
    'jscore/core',
    'uit!./rolesListFilterPlugin.html',
    '../../Dictionary',
    'jscore/ext/privateStore',
    'identitymgmtlib/widgets/FilterPlugin',
    'identitymgmtlib/widgets/CheckList',
    'jscore/ext/net',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler'
], function(core, View, Dictionary, PrivateStore, FilterPlugin, CheckList, net, responseHandler) {

    var _ = PrivateStore.create();

    return FilterPlugin.extend({

        init: function(options) {
            FilterPlugin.prototype.init.call(this, options);
            this.view = new View();
        },

        onStart: function() {

        },

        onViewReady: function() {
            //TODO: Add loading animation
            _(this).rolesContainer = this.view.findById('rolesContainer');

            _getRolesPromise().then(_appendRoles.bind(this))
                .catch(_showFetchingError.bind(this));

        },

        getData: function() {
            var result = {};
            var checkedRoles;

            if (_(this).rolesCheckList && (checkedRoles = _(this).rolesCheckList.getCheckedElements('value')) && (checkedRoles.length > 0)) {
                result[this.name] = checkedRoles;
                return result;
            }
        },

        clear: function() {
            if (_(this).rolesCheckList) {
                _(this).rolesCheckList.clearElements();
            }
        }

    });

    function _getRolesPromise() {
        return new Promise(function(result, reject) {
            net.ajax({
                url: '/oss/idm/rolemanagement/roles',
                dataType: 'json',
                success: function(data, xhr) {
                    result(data);
                },
                error: function(msg, xhr) {
                    responseHandler.setNotificationError({ response: xhr });
                    reject(msg);
                }
            });
        });
    }

    function _appendRoles(roles) {
        var mappedRoles = roles.map(function(role) {
            return {
                title: role.name,
                value: role.name,
                status: this.defaultValue ? this.defaultValue.some(function(value) {
                    return value === role.name;
                }) : false
            };
        }.bind(this));

        _(this).rolesCheckList = new CheckList({
            sortFunction: function(a, b) {
                return a.title.localeCompare(b.title);
            },
            elements: mappedRoles
        });

        _(this).rolesCheckList.attachTo(_(this).rolesContainer);
    }

    function _showFetchingError(msg) {
        //TODO: Error handling when roles are not fetched
        _(this).rolesContainer.setText(msg);
    }

});
