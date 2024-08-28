define([
    'jscore/core',
    'identitymgmtlib/Utils',
    '../../Dictionary',
    'uit!./profilesummaryrolerowcontent.html'
], function (core, Utils, Dictionary, View) {
    'use strict';

    var getTgsValue = function(tgs) {
        if (tgs.length === 1) {
            if (tgs[0] === 'ALL') {
                return 'ALL';
            } else if (tgs[0] === 'NONE') {
                return 'NONE';
            }
        }
        return tgs.length;
    };

    return core.Widget.extend({

        view: function () {
            var options = this.options,
                rowData = options.row.getData(),
                data = [];

            var type = rowData.type;

            data.push({ label: Dictionary.roleTable.columns.type + ":", value: Utils.type2String(type)});
            if (!Utils.isServiceRoleByType(type)) {
                if (Utils.isComRoleByType(type)) {
                    this.header = "comTGButton";
                    this.label = Dictionary.comTGButton + ":";
                } else  {
                    this.header = "cppTGButton";
                    this.label = Dictionary.cppTGButton + ":";
                }
                data.push({ label: this.label, value: getTgsValue(rowData.tgs), flyoutoptions: {tgs: rowData.tgs, header: this.header, nodeRole: true, rolename: rowData.roleName, username: this.options.userName}});
            }

            return new View({data: data});
        },

        onViewReady: function() {}

    });
});
