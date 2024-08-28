define([
    "jscore/core",
    "text!./PaginatedTable.html",
    "styles!./PaginatedTable.less"
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getTitle: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-title");
        },

        getCount: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-count");
        },

        getSelected: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-selected-label");
        },

        getSelectedSeparator: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-selected-separator");
        },

        getSelectedClear: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-selected-clear");
        },

        getFiltered: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-filtered-label");
        },

        getFilteredClear: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-filtered-clear");
        },

        getFooter: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-footer");
        },

        getPaginationWidget: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-footer-paginationHolder");
        },

        getShowRowsSeparator: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-footer-pageseparator");
        },

        getShowRowsWidget: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-footer-pageSizeSelect");
        },

        getSelectAllNotificationWidget: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-selectAllNotification");
        },

        getTableSettingsWidget: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-tableSettings");
        },

        getRefreshBtn: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-refresh");
        },

        getLoadedMarker: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-markers");
        },

        setLoadedMarkerDone: function(page, rows, totalpage) {
            this.getLoadedMarker().setAttribute('page', page);
            this.getLoadedMarker().setAttribute('rows', rows);
            this.getLoadedMarker().setAttribute('totalpage', totalpage);
            this.setModifier(this.getLoadedMarker(), "loaded", "done");
        },

        setLoadedMarkerLoading: function() {
            this.setModifier(this.getLoadedMarker(), "loaded", "inprogress");
        },

        setLoadedMarkerClear: function() {
            this.setModifier(this.getLoadedMarker(), "loaded", "notstarted");
        },

        setModifier: function(element, modifier, status) {
            if (element.hasModifier(modifier)) {
                element.removeModifier(modifier);
            }
            element.setModifier(modifier, status);
        },

        showLoader: function() {
            this.getElement().find(".elIdentitymgmtlib-PaginatedTable-loader-overlay").setModifier("show");
        },

        hideLoader: function() {
            this.getElement().find(".elIdentitymgmtlib-PaginatedTable-loader-overlay").removeModifier("show");
        },

        hideTableContainerHeader: function() {
            this.getElement().find(".elIdentitymgmtlib-PaginatedTable-container").setModifier('hide');
        },

        showTableContainerHeader: function() {
            this.getElement().find(".elIdentitymgmtlib-PaginatedTable-container").removeModifier('hide');
        },
        getTableContainer: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-table-container");
        },
        hideTable: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-table-container").setModifier('hide');

        },
        showTable: function() {
            return this.getElement().find(".elIdentitymgmtlib-PaginatedTable-table-container").removeModifier('hide');

        }

    });

});
