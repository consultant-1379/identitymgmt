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
    'container/api',
    './FiltersView',
    'identitymgmtlib/widgets/CheckList',
    'widgets/Accordion',
    '../../Dictionary'
], function(core, Container, View, CheckList, Accordion, Dictionary) {

    return core.Region.extend({

        roles: null,

        view: function() {
            return new View(Dictionary.filter);
        },

        setFilterValues: function(FilterValues) {
            this.clearFiltersForm();
            if(FilterValues.name) this.view.getFilterSearchInput().setValue(FilterValues.name);
            if(FilterValues.status) {
                FilterValues.status.forEach(function(element) {
                    this.roleStatusChecklist.selectElement(element);
                }.bind(this));
            }
            if(FilterValues.type) {
                FilterValues.type.forEach(function(element) {
                    this.roleTypesChecklist.selectElement(element);
                }.bind(this));
            }
        },

        onViewReady: function(options) {
            this.setListOfRoles();
            if(options && options.initialValues) this.setFilterValues.call(this, options.initialValues);
        },

        onStart: function() {
            this.addEventHandlers();
        },

        setListOfRoles: function() {

            // Role statues
            this.roleStatusChecklist = new CheckList({
                elements: [{
                    title: Dictionary.statusCell.RoleStatusEnabled,
                    value: 'ENABLED',
                    status: false
                }, {
                    title: Dictionary.statusCell.RoleStatusDisabled,
                    value: 'DISABLED',
                    status: false
                }, {
                    title: Dictionary.statusCell.RoleStatusNonassignable,
                    value: 'DISABLED_ASSIGNMENT',
                    status: false
                }]
            });

            var accordionRoleStatus = new Accordion({
                title: Dictionary.roleSummary.status,
                content: this.roleStatusChecklist,
                expanded: true
            });

            accordionRoleStatus.attachTo(this.view.getRoleStatusListContainer());

            // Role types
            this.roleTypesChecklist = new CheckList({
                sortFunction: function(a, b) {
                    //*
                    return a.title.localeCompare(b.title);
                    /*/
                    if (a.title > b.title) return 1;
                    if (a.title < b.title) return -1;
                    return 0;
                    //*/
                },
                elements: [{
                    title: Dictionary.typeCell.RoleTypeSystem,
                    value: 'system',
                    status: false
                }, {
                    title: Dictionary.typeCell.RoleTypeAlias,
                    value: 'comalias',
                    status: false
                }, {
                    title: Dictionary.typeCell.RoleTypeCom,
                    value: 'com',
                    status: false
                }, {
                    title: Dictionary.typeCell.RoleTypeCustom,
                    value: 'custom',
                    status: false
                }, {
                    title: Dictionary.typeCell.RoleTypeCpp,
                    value: 'cpp',
                    status: false
                }]
            });

            var accordionRoleTypes = new Accordion({
                title: Dictionary.roleSummary.roleType,
                content: this.roleTypesChecklist,
                expanded: true
            });

            accordionRoleTypes.attachTo(this.view.getRoleTypeListContainer());
        },

        addEventHandlers: function() {
            this.getEventBus().subscribe('filters:updatevalues', function(filter) {
                this.setFilterValues(filter);
            }.bind(this));

            this.handleClickApplyFilter();
            this.handleClickClearFilter();
            this.handleClickCancelFilter();
            this.handleApplyingFiltersOnEnter();
        },

        handleApplyingFiltersOnEnter: function() {
            this.view.getFilterSearchInput().addEventHandler('keydown', function(e) {
                if(e.originalEvent.code === "Enter" || e.originalEvent.key === "Enter") {
                    collectAndApplyFilters.call(this);
                }
            }.bind(this));
        },

        handleClickApplyFilter: function() {
            this.view.getFilterApplyButtonContainer().addEventHandler('click', function() {
                collectAndApplyFilters.call(this);
            }.bind(this));
        },

        handleClickClearFilter: function() {
            this.view.getFilterClearButtonContainer().addEventHandler('click', function() {
                this.clearFiltersForm();
                this.getEventBus().publish('mainregion:resetfilter');
            }.bind(this));
        },

        handleClickCancelFilter: function() {
            this.view.getFilterCancelButtonContainer().addEventHandler('click', function() {
                Container.getEventBus().publish('flyout:hide');
             }.bind(this));
        },

        onFilteredClear : function() {
            this.clearFiltersForm();
            this.getEventBus().publish('mainregion:resetfilter');
        },

        clearFiltersForm: function() {
            this.clearRoleName();
            this.roleStatusChecklist.clearElements();
            this.roleTypesChecklist.clearElements();
        },

        clearRoleName: function() {
            this.view.getFilterSearchInput().setValue('');
        },

        getFilterCriteria: function() {

            var filterRoleName = this.view.getFilterSearchInput().getValue();
            var selectedRoleStatuses = this.roleStatusChecklist.getCheckedElements('value');
            var selectedRoleTypes = this.roleTypesChecklist.getCheckedElements('value');

            //System and application roles are grouped, so when user filters data by ENM System Role both should be selected
            if(selectedRoleTypes.indexOf('system') >= 0) {
                selectedRoleTypes.push('application');
            }

            var filter = {};

            if (filterRoleName !== '') filter.name = filterRoleName;
            if (selectedRoleStatuses.length > 0) filter.status = selectedRoleStatuses;
            if (selectedRoleTypes.length > 0) filter.type = selectedRoleTypes;

            return filter;
        }

    });

    function collectAndApplyFilters() {
        var filterCriteria = this.getFilterCriteria();
        this.getEventBus().publish('mainregion:filter', filterCriteria);
    }
});
