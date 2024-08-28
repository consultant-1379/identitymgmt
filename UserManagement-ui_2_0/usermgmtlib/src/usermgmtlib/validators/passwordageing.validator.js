define([
    'jscore/ext/utils/base/underscore',
    '../Dictionary'
], function(_, Dictionary) {

    var _PWD_AGE_MAX = 180;
    var _PWD_EXP_MAX = 14;

    var _isInteger = function(number) {
        return /^(0|[1-9]\d*)$/.test(number);
    };

    var _validatePwdMaxAgeExtremes = function(pwdMaxAge) {
        // as in system-security-configurator values are hardwired
        if(_isInteger(pwdMaxAge) && parseInt(pwdMaxAge) > 0 && parseInt(pwdMaxAge) <= _PWD_AGE_MAX) {
            return true;
        }
        return false;
    };

    var _validatePwdExpireWarnExtremes = function(pwdExpWarn) {
        // as in system-security-configurator values are hardwired
        if(_isInteger(pwdExpWarn) && parseInt(pwdExpWarn) >= 0 && parseInt(pwdExpWarn) <= _PWD_EXP_MAX) {
            return true;
        }
        return false;
    };

    return {
        validate: function(data, strictMode) {
            var output = {};

            if ( data.customizedPasswordAgeingEnable && data.passwordAgeingEnable ) {
                if (!(data.pwdMaxAge) && strictMode) {
                    output.messageAge = Dictionary.validator.pwdMaxAge.must_be_specified;
                    output.isPwdAge = true;
                }
                if (!_validatePwdMaxAgeExtremes(data.pwdMaxAge) && strictMode) {
                    if(output.isPwdAge === undefined) {
                        output.messageAge = Dictionary.validator.pwdMaxAge.policies_must_fulfilled;
                        output.isPwdAge = true;
                    }
                }
                if ((data.pwdExpireWarning === undefined || data.pwdExpireWarning === "") && strictMode) {
                    if(output.isPwdExpire === undefined) {
                        output.messageExpire = Dictionary.validator.pwdExpireWarning.must_be_specified;
                        output.isPwdExpire = true;
                    }
                }
                if (!_validatePwdExpireWarnExtremes(data.pwdExpireWarning) && strictMode) {
                    if(output.isPwdExpire === undefined) {
                        output.messageExpire = Dictionary.validator.pwdExpireWarning.policies_must_fulfilled;
                        output.isPwdExpire = true;
                    }
                }
                if ((parseInt(data.pwdExpireWarning) >= parseInt(data.pwdMaxAge)) && strictMode) {
                    if(output.isPwdExpire === undefined) {
                        output.messageExpire = Dictionary.validator.pwdExpireWarning.must_be_less_than;
                        output.isPwdExpire = true;
                    }
                }
            }

            if(Object.keys(output).length > 0) {
                return output;
            }
        }
    };
});
