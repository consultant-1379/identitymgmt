define([
    "jscore/core",
    'identitymgmtlib/SystemTime',
    'identitymgmtlib/Utils'
], function (core, SystemTime, Utils) {
    'use strict';

    var convertArrayOfObjectsToCSV = function(data) {
        var ctr = null,
            keys = Object.keys(data[0]),
            columnDelimiter = (data.columnDelimiter || ','),
            lineDelimiter = (data.lineDelimiter || '\n'),
            result = '' + keys.join(columnDelimiter) + lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) {
                    result += columnDelimiter;
                }
                if(Array.isArray(item[key])) {
                    result += "|";
                    for(var role in item[key]) {
                        for(var targetGroup in item[key][role].targetGroups) {
                            result += item[key][role].name + ":";
                            result += item[key][role].targetGroups[targetGroup] + "|";
                        }
                    }
                } else if(typeof item[key] === "object"){
                    result += "|";
                    for(var prop in item[key]){
                        result += prop + ":" +item[key][prop] + "|";
                    }
                } else{
                    result += item[key];
                    ctr++;
                }
            });
            result += lineDelimiter;
        });
        return result;
    };

    var convertArrayOfObjectsToXML = function(data) {
        var result = '<?xml version="1.0" encoding="utf-8"?>\n';

        var parseArray = function(array, tag) {
            result = startTag(tag) + "\n";
            for(var key in array){
                if(typeof array[key] === "string") {
                    result += startTag(tag.slice(0, tag.length - 1));
                    result += safeXMLValue(array[key]);
                }else {
                    result += startTag(tag.slice(0, tag.length - 1)) + "\n";
                    for(var item in array[key]) {
                        if(Array.isArray(array[key][item])) {
                            result += parseArray(array[key][item],item);
                        } else if(typeof array[key][item] === "object") {
                            result += parseObject(array[key][item], item);
                        } else {
                            result += startTag(item) + safeXMLValue(array[key][item]) + endTag(item);
                        }
                    }
                }
                result += endTag(tag.slice(0, tag.length - 1));
            }
            result += endTag(tag);
            return result;
        };

        var startTag = function(argument) {
            var tmp = "<" + argument + ">";
            return tmp;
        };

        var endTag = function(argument) {
            var tmp = "</" + argument + ">\n";
            return tmp;
        };

        var parseObject = function(object ,name){
            var objStr = "";
            objStr += startTag(name) + "\n";
            for(var prop in object) {
                objStr += startTag(prop) + safeXMLValue(object[prop]) + endTag(prop);
            }
            objStr += endTag(name);
            return objStr;
        };

        var safeXMLValue = function (value) {

            var s = value.toString();
            s = Utils.replaceALL(s, '\&', '&amp;');
            s = Utils.replaceALL(s, '\"', '&quot;');
            s = Utils.replaceALL(s, '<', '&lt;');
            s = Utils.replaceALL(s, '>', '&gt;');
            return s;
        };

        result += parseArray(data, "users");

        return result;
    };

    var downloadReport = function (report, format) {

        if(!report) {
            return;
        }

        var anchor = document.createElement('a');
        anchor.setAttribute('href', report);
        anchor.setAttribute('download', 'UserProfiles.' + format);

        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        anchor.dispatchEvent(ev);
    };

    var refactorUsersData = function (data) {
        var refactoredFilteredUsers = [];
        data.forEach(function (model) {
            refactoredFilteredUsers.push({
                name: model.username ? model.username : "",
                password: "",
                changePasswordFlag: model.passwordResetFlag ? model.passwordResetFlag : false,
                status: model.status ? model.status : "",
                firstname: model.name ? model.name : "",
                surname: model.surname ? model.surname : "",
                email: model.email ? model.email : "",
                description: model.description ? model.description : "",
                privileges: model.privileges ? model.privileges : "",
                passwordAgeing: model.passwordAgeing ? model.passwordAgeing : "",
                authMode: model.authMode ? model.authMode : ""
            });
        });

        return refactoredFilteredUsers;
    };

    return {

        createReportCSV: function (usersData) {//if there is a need for *.csv, this method should be used

            if(!usersData) {
                return;
            }

            var filteredUsersData = refactorUsersData(usersData);
            var csv = convertArrayOfObjectsToCSV(filteredUsersData);
            csv = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
            downloadReport(csv, "csv");
        },

        createReportXML: function (usersData) {
            if(!usersData) {
                return;
            }

            var filteredUsersData = refactorUsersData(usersData);
            var xml = convertArrayOfObjectsToXML(filteredUsersData);
            xml = 'data:application/xml,' + encodeURIComponent(xml);
            downloadReport(xml, "xml");
        }
    };
});
