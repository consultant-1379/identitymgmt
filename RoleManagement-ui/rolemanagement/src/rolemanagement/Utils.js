define([
    "./Dictionary"
], function(Dictionary) {

    return {
        status2String: function(status) {
            if (status === true || status.toLowerCase() === 'enabled') {
                return Dictionary.statusCell.RoleStatusEnabled;
            } else if (status === false || status.toLowerCase() === 'disabled' ) {
                return Dictionary.statusCell.RoleStatusDisabled;
            } else if (status.toLowerCase() === 'disabled_assignment') {
                return Dictionary.statusCell.RoleStatusNonassignable;
            }
        }
    };
});