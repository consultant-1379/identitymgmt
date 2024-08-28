define([
    'jscore/core',
    'identitymgmtlib/FilterComparator',
    'identitymgmtlib/services/TimeService',
    'identitymgmtlib/services/PasswordPolicyService',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'identitymgmtlib/SystemTime'
], function(core, FilterComparator, timeService, passwordService, responseHandler, systemTime) {
    'use strict';

    var _daysInMilliseconds = 86400000;
    var _pwdAgeingEnabled = true;
    var _serverTimeStamp;
    var globalPwdAgeValidationRules = function() {

        timeService.getServerTime()
        .then(function(serverTime) {
            _serverTimeStamp = serverTime.timestamp;
            passwordService.getValidationRulesWithPwdAgeing().then(
                function(data) {
                    _pwdAgeingEnabled = data.enabled;
                    this.dateCalculatedWithGlobal = _serverTimeStamp - _daysInMilliseconds * data.pwdMaxAge;
                }.bind(this),
                function(xhr) {
                    responseHandler.setNotificationError({response: xhr});
                }.bind(this));
        }.bind(this), function(xhr) {
                responseHandler.setNotificationError({response: xhr});
            }
        );};

    return FilterComparator.extend({

        dateCalculatedWithGlobal: null,

        init: function(options) {
            globalPwdAgeValidationRules.call(this);
        },

        filter: function(value, filterCriteria) {
            if(value === null || value === undefined) {return false;}
            if(value.passwordChangeTime === null || value.passwordChangeTime === undefined) {
                return false;
            }
            var compare = systemTime.formatLdapTimestamp(value.passwordChangeTime);

            if(value.passwordAgeing === null || value.passwordAgeing === undefined ||
                    value.passwordAgeing.customizedPasswordAgeingEnable === null ||
                    value.passwordAgeing.customizedPasswordAgeingEnable === undefined ||
                    value.passwordAgeing.customizedPasswordAgeingEnable === false) {
                return filterCriteria.some(function(criteria) {
                    if(criteria === "expired") {
                        return _pwdAgeingEnabled ? compare < this.dateCalculatedWithGlobal : false;
                    } else {
                        return _pwdAgeingEnabled ? compare > this.dateCalculatedWithGlobal : true;
                    }
                }.bind(this));
            } else { //user has got customized pwd Ageing
                var dateCalculatedWithCustom = _serverTimeStamp - _daysInMilliseconds * value.passwordAgeing.pwdMaxAge;
                return filterCriteria.some(function(criteria) {
                    if(criteria === "expired") {
                        return value.passwordAgeing.passwordAgeingEnable ? compare < dateCalculatedWithCustom : false;
                    } else {
                        return value.passwordAgeing.passwordAgeingEnable ? compare > dateCalculatedWithCustom : true;
                    }
                }.bind(this));
            }
        }
    });
});
