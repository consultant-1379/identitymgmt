define([
    'test/bit/lib/Browser'
], function(Browser) {

    var selector = {

        button: '.ebBtn',
        paragraph: 'p',
        tableitem: 'td',

        title: '.elLayouts-TopSection-title',
        topSectionButtons: '.elLayouts-ActionBarButton',

        nameInput: '.eaTargetmgmtlib-targetgroupForm-name',
        descriptionInput: '.eaTargetmgmtlib-targetgroupForm-description',

        nameValidationError: '.eaTargetmgmtlib-targetgroupForm-nameStatus span.ebInput-statusError',
        descriptionValidationError: '.eaTargetmgmtlib-targetgroupForm-descriptionStatus span.ebInput-statusError',

        tableRow: '.elTablelib-Table-body > .ebTableRow',

        filterTargetInput: 'input.elTablelib-QuickFilter-text',

        inlineMessage: '.ebInlineMessage-header'
    };

    return {

        waitForTitleElement: function(timeout) {
            return Browser.waitForElement(selector.title, timeout);
        },

        setName: function(_name) {
            var name = Browser.getElement(selector.nameInput);
            name.setValue(_name);
        },

        setDescription: function(_description) {
            var description = Browser.getElement(selector.descriptionInput);
            description.setText(_description);
        },

        onResume: function(_app) {
            _app.onResume();
        },

        saveCreateTargetGroup: function() {
            var buttons = Browser.getElements(selector.topSectionButtons);
            buttons[0].trigger('click');
        },

        clickOnRemoveButton: function() {
            var buttons = Browser.getElements(selector.topSectionButtons);
            buttons[4].trigger('click');
        },

        clickOnCancelButton: function() {
            var buttons = Browser.getElements(selector.topSectionButtons);
            buttons[1].trigger('click');
        },

        getNameValidatorField: function(_text,_timeout){
             return Browser.waitForElementWithValue(selector.nameValidationError,_text,_timeout);
        },

        getDescriptionValidatorField: function(_text,_timeout){
             return Browser.waitForElementWithValue(selector.descriptionValidationError,_text,_timeout);
        },

        verifyTargets: function(_targetName) {
            return Browser.waitForElementsWithValue(selector.tableitem, _targetName, 2000).then(
                function(element) {
                    console.log("Found Element for targetName " + _targetName);
                }).catch( function() {
                    throw new Error("Not Found Element for targetName " + _targetName);
                }
                );
        },

        verifyInlineMessage: function(_message) {
            return Browser.waitForElementsWithValue(selector.inlineMessage, _message, 2000).then(
                function(element) {
                    console.log("Found Element for inlineMessage " + _message);
                }).catch( function() {
                    throw new Error("Not Found Element for inlineMessage " + _message);
                }
                );
        },

        tableRows: function() { //Table with whole row data
            return Browser.getElements(selector.tableRow);
        },

        putFilterTargetName: function(_targetname) {
            
            var filterFields = Browser.getElements(selector.filterTargetInput);
            
            if (filterFields && filterFields.length > 0 && filterFields[0]) {
                filterFields[0].setValue(_targetname);
                filterFields[0].trigger('input');
            } else {
                throw new Error("Not Found Element to filter name " + _targetname);
            }
        },

        putFilterTargetType: function(_targettype) {
            
            var filterFields = Browser.getElements(selector.filterTargetInput);
            
            if (filterFields && filterFields.length > 0 && filterFields[1]) {
                filterFields[1].setValue(_targettype);
                filterFields[1].trigger('input');
            } else {
                throw new Error("Not Found Element to filter type " + _targettype);
            }
        }

    };
});
