define([
    'jscore/core',
    'test/bit/lib/Browser'
], function(core, Browser) {

    var _timeout = {
        short: 100,
        medium: 500,
        long: 1000
    };

    var selector = {
        nextButton: '.ebWizard-footerBtnNext',
        finishButton: '.ebWizard-footerBtnFinish',
        previousButton: '.ebWizard-footerBtnPrevious',
        modifyStatusCheckbox: '.eaUsersgroupedit-StepDetails-status',
        modifyDescriptionCheckbox: '.eaUsersgroupedit-StepDetails-description',
        modifyRolesCheckbox: '.eaUsersgroupedit-StepRoles-roles',
        statusSwitcher: '.eaUsersgroupedit-StepDetails-Switcher',
        descriptionTextArea: '.eaUsersgroupedit-StepDetails-TextArea',
        rolesSelectBoxButton: '.eaUsersgroupedit-StepRoles-SelectBoxRoles > button',
        rolesSelectBoxOption: function(optionName) {
            return '.elWidgets-ComponentList div.ebComponentList-item[title="' + optionName + '"]';
        },
        rolesTableWidget: '.eaUsersgroupedit-wRoleAssignTableWidget',
        allRolesCount: '.eaUsersgroupedit-wRoleAssignTableWidget-resultsRole-all',
        assignedRolesCount:'.eaUsersgroupedit-wRoleAssignTableWidget-resultsRole-assigned',
        roleTickButton: function(roleName) {
            return '#TD_TG_ASSIGN_ICON_' + roleName + ' .eaUsermgmtlib-cCheckboxCell-wrap > input';
        },
        targetGroupButton: function(roleName) {
            return '#TD_TG_ASSIGN_BUTTON_' + roleName /*+ ' > button'*/;
        },
        summaryMessages: '.eaUsersgroupedit-StepSummary-ListElement',
        totalCount: '.eaUsersgroupedit-wResultsTableWidget-topResultsBar-total',
        successCount: '.eaUsersgroupedit-wResultsTableWidget-topResultsBar-successful',
        failureCount: '.eaUsersgroupedit-wResultsTableWidget-topResultsBar-failed',
        resultsTable: '.elTablelib-Table-table',
        allLink: '.eaUsersgroupedit-wRoleAssignTableWidget-filter-assign-roles-link-all',
        noneLink: '.eaUsersgroupedit-wRoleAssignTableWidget-filter-assign-roles-link-none',
        pwdAgeingArea: '.eaUsermgmtlib-wUserMgmtCustomPwd-detailsContainer',
        modifyPwdAgeingCheckbox: '.eaUsersgroupedit-StepSecurity-pwdAgeing',
        authModeDropdown: '.eaUsersgroupedit-StepSecurity-DropdownAuthMode',
        modifyAuthModeCheckbox: '.eaUsersgroupedit-StepSecurity-authMode'
    };

    return {

        waitForRoleTickButton: function(roleName, timeout) {
            return Browser.waitForElement(selector.roleTickButton(roleName), timeout || _timeout.short);
        },

        waitForTargetGroupButton: function(roleName, timeout) {
            return Browser.waitForElement(selector.targetGroupButton(roleName), timeout || _timeout.short);
        },

        waitForAssignedRolesCount: function(timeout) {
            return Browser.waitForElement(selector.assignedRolesCount, timeout || _timeout.short);
        },

        waitForAllRolesCount: function(timeout) {
            return Browser.waitForElement(selector.allRolesCount, timeout || _timeout.short);
        },

        waitForRolesTableWidget: function(timeout) {
            return Browser.waitForElement(selector.rolesTableWidget, timeout || _timeout.short);
        },

        waitForRolesSelectBoxButton: function(timeout) {
            return Browser.waitForElement(selector.rolesSelectBoxButton, timeout || _timeout.short);
        },

        waitForModifyRolesCheckbox: function(timeout) {
            return Browser.waitForElement(selector.modifyRolesCheckbox, timeout || _timeout.short);
        },

        waitForRolesSelectBoxOption: function(optionName, timeout) {
            return Browser.waitForElement(selector.rolesSelectBoxOption(optionName), timeout || _timeout.short);
        },

        waitForResultTable: function(timeout) {
            return Browser.waitForElement(selector.resultsTable, timeout || _timeout.short);
        },

        waitForNextButton: function(timeout) {
            return Browser.waitForElement(selector.nextButton, timeout || _timeout.short);
        },

        waitForFinishButton: function(timeout) {
            return Browser.waitForElement(selector.finishButton, timeout || _timeout.short);
        },

        waitForSuccessCount: function(timeout) {
            return Browser.waitForElement(selector.successCount, timeout || _timeout.short);
        },

        waitForFailureCount: function(timeout) {
            return Browser.waitForElement(selector.failureCount, timeout || _timeout.short);
        },

        waitForTotalCount: function(timeout) {
            return Browser.waitForElement(selector.totalCount, timeout || _timeout.short);
        },

        waitForPreviousButton: function(timeout) {
            return Browser.waitForElement(selector.previousButton, timeout || _timeout.short);
        },

        waitForModifyStatusCheckbox: function(timeout) {
            return Browser.waitForElement(selector.modifyStatusCheckbox, timeout || _timeout.short);
        },

        waitForModifyDescriptionCheckbox: function(timeout) {
            return Browser.waitForElement(selector.modifyDescriptionCheckbox, timeout || _timeout.short);
        },

        waitForStatusSwitcher: function(timeout) {
            return Browser.waitForElement(selector.statusSwitcher, timeout || _timeout.short);
        },

        waitForDescriptionTextArea: function(timeout) {
            return Browser.waitForElement(selector.descriptionTextArea, timeout || _timeout.short);
        },

        waitForSummaryMessages: function(timeout) {
            return Browser.getElements(selector.summaryMessages);
        },

        waitForAllRolesLink: function(timeout){
            return Browser.waitForElement(selector.allLink, timeout || _timeout.short);
        },

        waitForNoneRolesLink: function(timeout){
            return Browser.waitForElement(selector.noneLink, timeout || _timeout.short);
        },

        waitForPwdAgeingArea: function(timeout) {
            return Browser.waitForElement(selector.pwdAgeingArea, timeout || _timeout.short);
        },

        waitForModifyPwdAgeingCheckbox: function(timeout) {
            return Browser.waitForElement(selector.modifyPwdAgeingCheckbox, timeout || _timeout.short);
        },

        waitForAuthModeDropdown: function(timeout) {
            return Browser.waitForElement(selector.authModeDropdown, timeout || _timeout.short);
        },

        waitForModifyAuthModeCheckbox: function(timeout) {
            return Browser.waitForElement(selector.modifyAuthModeCheckbox, timeout || _timeout.short);
        },
    };
});
