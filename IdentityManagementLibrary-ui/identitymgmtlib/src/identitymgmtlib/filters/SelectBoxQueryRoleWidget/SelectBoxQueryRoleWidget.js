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
    'identitymgmtlib/mvp/binding',
    'uit!./selectBoxQueryRoleWidget.html',
    'i18n!identitymgmtlib/common.json',
    'widgets/SelectBox',
    'widgets/Tooltip'
], function(core, PrivateStore, binding, View, Dictionary, SelectBox, Tooltip) {
    var _ = PrivateStore.create();

    return core.Widget.extend({
        view: function() {
            this.items = {
                equals: {
                    name: '=',
                    value: true
                },
                notEquals: {
                    name: '!=',
                    value: false
                }
            };

            return new View({
                dropdownOptions: {
                    modifiers: [{
                        name: 'width',
                        value: 'mini'
                    }],
                    value: this.items.equals,
                    items: [this.items.equals, this.items.notEquals]
                }
            });

        },

        init: function() {},

        onViewReady: function() {
            //change CSS in roles table
            this.changeSelectBoxStyle();

            this.view.findById('selectBoxQueryRole').addEventHandler('change', this.triggerChange.bind(this));
            this.triggerChange();
        },

        triggerChange: function() {
            var value = this.getValue.call(this);
            this.trigger('change', value);
            //set tooltip
            this.setTooltip(value);
        },

        getValue: function() {
            return this.view.findById('selectBoxQueryRole').getValue().value;
        },

        setValue: function(value) {
            //set tooltip
            this.setTooltip(value);

            this.view.findById('selectBoxQueryRole').setValue(value ? this.items.equals : this.items.notEquals);
        },

        setTooltip: function(value) {
            //set tooltip
            var tooltipText = Dictionary.filters.roles.selectBox.equals;
            if(value !== true) {
                tooltipText = Dictionary.filters.roles.selectBox.notEquals;
            }
            //tooltip
            if(this.tooltip) {
               this.tooltip.setContentText(tooltipText);
            } else {
                this.tooltip = new Tooltip({
                    parent: this.getSelectBoxHeader(),
                    contentText: tooltipText
                });
            }
        },

        getSelectBoxHeader: function() {
            return this.getElement().find('.elIdentitymgmtlib-SelectBoxQueryRoleCell-SelectBoxQueryRoleWidget button.ebSelect-header');
        },


        changeSelectBoxStyle: function() {
            this.getElement().find('.elIdentitymgmtlib-SelectBoxQueryRoleCell-SelectBoxQueryRoleWidget span.ebSelect-value').setStyle("width", "15px");
            this.getSelectBoxHeader().setStyle("width", "55%");
        }

    });

});
