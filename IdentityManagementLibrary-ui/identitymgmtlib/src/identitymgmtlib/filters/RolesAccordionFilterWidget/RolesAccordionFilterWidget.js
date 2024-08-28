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
    'uit!./rolesAccordionFilterWidget.html',
    'i18n!identitymgmtlib/common.json',
    'widgets/InfoPopup',
], function(core, PrivateStore, View, Dictionary, InfoPopup) {
    var _ = PrivateStore.create();

    return core.Widget.extend({

        view: function() {
            return new View({
                title: Dictionary.filters.roles.title
            });
        },

        onViewReady: function (options) {

            this.infoPopup = new InfoPopup({
                content: Dictionary.filters.roles.info
            });

            this.infoPopup.attachTo(this.getElement().find('.elIdentitymgmtlib-rolesAccordionFilterWidget-infoIconBox'));

            //show/hide content widget after click in accordion header
            this.isExpanded = false;
            this.getElement().find('.elIdentitymgmtlib-rolesAccordionFilterWidget-header-empty').addEventHandler('click', function(event) {
                this.toggleWidget.call(this);
            }.bind(this));

            this.getElement().find('.elIdentitymgmtlib-rolesAccordionFilterWidget-title').addEventHandler('click', function(event) {
                this.toggleWidget.call(this);
            }.bind(this));

        },

        toggleWidget: function () {
            this.isExpanded = !this.isExpanded;
            this.trigger('toggle', this.isExpanded);
        }

    });

});
