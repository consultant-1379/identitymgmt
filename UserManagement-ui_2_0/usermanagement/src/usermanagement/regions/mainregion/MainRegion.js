define([
    'jscore/core',
    'jscore/ext/net',
    'container/api',
    'identitymgmtlib/widgets/TableSettings',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/StickyScrollbar',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/PinColumns',
    'usermgmtlib/widgets/StatusUserCell',
    'usermgmtlib/cells/CredentialStatusCell',
    'usermgmtlib/cells/FailedLoginsCell',
    'usermgmtlib/cells/AuthModeCell',
    'identitymgmtlib/PaginatedTable',
    'identitymgmtlib/widgets/ShowRows',
    'identitymgmtlib/UsersExport',
    'usermgmtlib/DataHandler',
    '../../widgets/datecell/DateCell',
    'identitymgmtlib/widgets/TableSelectionInfoWidget',
    '../../ActionsManager',
    '../../Dictionary',
    './MainRegionView',
    'usermgmtlib/services/UserManagementService',
    'usermgmtlib/widgets/ResponseHandler/ResponseHandler',
    'usermgmtlib/widgets/ConfirmationDeleteUsersDialog/ConfirmationDeleteUsersDialog',
    'usermanagement/regions/ProfileSummary/ProfileSummary',
    'usermanagement/filters/LoginFilterComparator',
    'usermanagement/filters/FailedLoginsFilterComparator',
    'usermanagement/filters/CredentialsStatusFilterComparator',
    'usermanagement/filters/PwdAgeFilterComparator',
    'usermanagement/filters/CustomPwdAgeFilterComparator',
    'usermanagement/filters/RolesFilterComparator',
    '../../widgets/importWidgets/uploadingFileDialog/UploadingFileDialog',
    '../../widgets/importWidgets/expandedImportNotification/ExpandedImportNotification',
    '../../widgets/federatedStatusNotification/FederatedStatusNotification',
    '../../widgets/importWidgets/notificationsFlyout/NotificationsFlyout',
    '../../widgets/importWidgets/analysisDialog/AnalysisDialog',
    '../../widgets/exportingProfilesDialog/ExportingProfilesDialog',
    'jscore/base/jquery',
    'webpush/main'
], function(core,
    net, container,TableSettings, SortableHeader, StickyScrollbar, ResizableHeader, PinColumns, StatusUserCell, CredentialStatusCell, FailedLoginsCell, AuthModeCell, PaginatedTable, ShowRows, UsersExport, DataHandler, DateCell, TableSelectionInfoWidget, ActionsManager, Dictionary, View, UserManagementService, responseHandler, ConfirmationDeleteUsersDialog, ProfileSummary, LoginFilterComparator, FailedLoginsFilterComparator, CredentialsStatusFilterComparator, PwdAgeFilterComparator, CustomPwdAgeFilterComparator, RolesFilterComparator, UploadingFileDialog, ExpandedImportNotification, FederatedStatusNotification, NotificationsFlyout, AnalysisDialog, ExportingProfilesDialog, jquery, webpush
) {
    'use strict';


    function showLoader() {
        container.getEventBus().publish('container:loader');
    }

    function hideLoader() {
        container.getEventBus().publish('container:loader-hide');
    }

    var profileSummaryPanels = [];
    var sessionPromises = null;
    var maximumUsersNrAvailableToBeExported = 1000;

    var refreshSessions = function() {
        return new Promise(function(resolve, reject) {
            UserManagementService.getSessions().then(function(sessions) {
                //all ProfileSummary panels listen to this event and update Instances values
                this.sessionsInstances = sessions;
                this.getEventBus().publish('profilesummary:sessions-update', sessions);
                sessionPromises = null;
                resolve();
            }.bind(this), reject);
        }.bind(this)).catch(function() {
            this.sessionsInstances = null;
            responseHandler.setNotificationError({ response: Dictionary.error_get_sessions });
            this.getEventBus().publish('profilesummary:sessions-update', null);
        }.bind(this));
    };

    var enforcedUserHardening = function () {
        return new Promise(function(resolve, reject) {
            UserManagementService.getEnforceUserHardeningState().then(function(euh) {            
                this.enforcedUserHardening = euh;
                ActionsManager.setEnforcedUserHardening(this.enforcedUserHardening);                
                resolve();
            }.bind(this), reject);
        }.bind(this));
    };

    var getProfileSummary = function() {
        var selectedRow = this.selectedRows[0] || {};
        if (!sessionPromises) {
            sessionPromises = refreshSessions.call(this);
        }

        var exists = profileSummaryPanels.filter( function (o) {
            return o.hasOwnProperty(selectedRow.username);
        }).length > 0;

        if (!exists) {
            profileSummaryPanels[selectedRow.username] = {
                side: 'right',
                header: Dictionary.profileSummary,
                content: new ProfileSummary({
                    context: this.getContext(),
                    username: selectedRow.username,
                    federated: this.options.isFederatedView,
                    sessions: this.sessionsInstances,
                    odpProfiles: selectedRow.odpProfiles
                }),
                value: 'profileSummary'
            };
            profileSummaryPanels.length++;
        } else {
            profileSummaryPanels[selectedRow.username].content.updatePrivileges();
        }

        return profileSummaryPanels[selectedRow.username];
    };

    var _subscribeToWebpushImportChannel = function() {
        this.channel = webpush.subscribe({
            channel: "importexportnotifications:parsing",
            callback: function(data) {

                // this.uploadingFileDialog is defined if I pressed the Import button
                if ( this.uploadingFileDialog ) {

                    switch (data.eventType) {
                        case "STARTED":
                            this.uploadingFileDialog.started();
                            break;

                        case "PROGRESS":
                            this.uploadingFileDialog.progress(data);
                            break;

                        case "FINISHED_WITH_ERROR":
                            this.uploadingFileDialog.finishedWithError();
                            break;

                        case "FINISHED":
                            this.uploadingFileDialog.finished();

                            UserManagementService.startImportAnalysis({
                                importId: data.importId
                            }).then(function(analysis) {
                                this.uploadingFileDialog.hide();
                                this.showImportAnalysis(analysis);
                            }.bind(this), function() {
                                this.uploadingFileDialog.hide();
                            }.bind(this));
                            break;
                    }
                }

            }.bind(this),
            filters: [{
                attr_name: 'owner',
                operator: 'eq',
                attr_value: this.loggedUser
            }],
            success: function() {
                ActionsManager.enableImportButton();
                this.getEventBus().publish('topsection:defaultactions', ActionsManager.getActions(undefined, true));
                console.log("SUBSCRIPTION SUCCESS");
            }.bind(this),
            error: function() {
                if (this.expandedImportNotification) {
                    this.expandedImportNotification.attachNotification("SUBSCRIPTION_FAILED");
                }
                console.log("SUBSCRIPTION FAILED");
            }.bind(this)
        });
    };

    return core.Region.extend({
        selectedRows: [],
        tableStatus:{},
        profileSummaryVisible: false,
        visiblePanel: 'none',
        View: View,
        sessionsInstances: undefined,
        subscribeIds: {},
        enforcedUserHardening: false,

        onViewReady: function() {
            this.startWebpushImportChannels();
            
            this.setupDataHandler();
            this.setupShowRows();
            this.setupTableSettings();
            this.setupTable();
            if ( this.options && this.options.isFederatedView===true ) {
                this.federatedStatusNotification = new FederatedStatusNotification();
                this.federatedStatusNotification.attachTo(this.view.getNotification());
                this.federatedStatusNotification.addEventHandler('refresh', function() {
                    this.paginatedTable.refreshData();
                }.bind(this));
            }
        },

        onResume: function() {
            this.getEnforceUserHardening();
            this.addSubscribtions();
            if ( this.queryParams ) {
                this.getEventBus().publish('locationcontroller:updatequeryparams', this.queryParams);
            }

            if ( this.federatedStatusNotification ) {
                this.federatedStatusNotification.getLastSyncReport();
            }
        },

        refreshData: function() {
            this.paginatedTable.refreshData();
        },

        getEnforceUserHardening: function() {
            enforcedUserHardening.call(this);
            
        },

        onPause: function() {
            this.removeSubscribtions();
        },

        saveStatus:function(){
           this.tableStatus.currentPage = this.paginatedTable.getCurrentPage();
           this.tableStatus.showRows = this.showRows.getValue().value;

        },

        restoreStatus:function(){
           this.showRows.setValue(this.tableStatus.showRows);
           this.paginatedTable.getPageData(this.tableStatus.currentPage,true,true);
           this.refreshDataNeeded();
        },

        setMSP: function(multiSlidingPanel){
            this.multiSlidingPanel = multiSlidingPanel;
        },

        setupDataHandler:function(){
           this.dataHandler = new DataHandler({
              uniqueID: 'username',
              federated: this.options.isFederatedView,
              filter: {
                  comparators: {
                      lastLogin: LoginFilterComparator,
                      failedLogins: FailedLoginsFilterComparator,
                      expirationData: PwdAgeFilterComparator,
                      passwordAgeing: CustomPwdAgeFilterComparator,
                      credentialStatus: CredentialsStatusFilterComparator,
                      roles: RolesFilterComparator
                  }
              }
          });

        },

        setupShowRows:function(){
            this.showRows = new ShowRows();
        },


        setupTableSettings: function(){
            if ( this.options.isFederatedView ) {
                this.columns = [{
                    title: Dictionary.username,
                    attribute: 'username',
                    width: '200px',
                    sortable: true,
                    resizable: true,
                    disableVisible: true
                }, {
                    title: Dictionary.credentialStatus,
                    width: '250px',
                    attribute: 'credentialStatus',
                    cellType: CredentialStatusCell,
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.lastLogin,
                    attribute: 'lastLogin',
                    cellType: DateCell,
                    width: '200px',
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.failedLogins,
                    attribute: 'failedLogins',
                    cellType: FailedLoginsCell,
                    width: '200px',
                    sortable: true,
                    resizable: true
                }];
            } else {
                this.columns = [{
                    title: Dictionary.username,
                    attribute: 'username',
                    width: '175px',
                    sortable: true,
                    resizable: true,
                    disableVisible: true
                } ,{
                    title: Dictionary.status,
                    attribute: 'statusColumn',
                    cellType: StatusUserCell,
                    width: '100px',
                    sortable: true,
                    resizable: true
                },{
                    title: Dictionary.name,
                    attribute: 'name',
                    width: '175px',
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.surname,
                    attribute: 'surname',
                    width: '175px',
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.description,
                    attribute: 'description',
                    width: '175px',
                    sortable: true,
                    resizable: true
                },
                {
                    title: Dictionary.authMode,
                    attribute: 'authMode',
                    cellType: AuthModeCell,
                    width: '165px',
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.email,
                    attribute: 'email',
                    width: '175px',
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.credentialStatus,
                    width: '125px',
                    attribute: 'credentialStatus',
                    cellType: CredentialStatusCell,
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.lastLogin,
                    attribute: 'lastLogin',
                    cellType: DateCell,
                    width: '175px',
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.failedLogins,
                    attribute: 'failedLogins',
                    cellType: FailedLoginsCell,
                    width: '128px',
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.forcePasswordChange,
                    width: '175px',
                    attribute: 'passwordResetFlagColumn',
                    sortable: true,
                    resizable: true
                }, {
                    title: Dictionary.filters.passwordAgeing.title,
                    width: '175px',
                    attribute: 'passwordAgeingColumn',
                    resizable: true,
                    sortable: true
                } ];
            }

            this.tableSettings = new TableSettings({
                columns:this.columns
            });

            this.tableSettings.addEventHandler('table-settings:change', function () {
                //data refresh is needed to fill the table
                this.setupTable(true);
            }.bind(this));
        },

        setupTable: function(restoreStatus) {
            if (this.paginatedTable) {
                this.saveStatus();
                this.paginatedTable.destroy();
            }

            var selectAllNotification = new TableSelectionInfoWidget({
                icon: 'ebIcon ebIcon_dialogInfo',
                itemSingularPredicate: Dictionary.tableSelectionInfoWidgetUM.roleSingularPredicate,
                itemPluralPredicate: Dictionary.tableSelectionInfoWidgetUM.rolePluralPredicate
            });

            this.paginatedTable = new PaginatedTable({
                    title: Dictionary.users,
                    headerInfo: Dictionary.tableHeaderInformation,
                    uniqueID: 'username',
                    widgets: {
                        showRows: this.showRows,
                        selectAllNotification: selectAllNotification,
                        tableSettings:this.tableSettings
                    },
                    pageSize: (this.tableStatus.showRows)?this.tableStatus.showRows:50,
                    dataHandler: this.dataHandler,
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: this.tableSettings !== undefined ? this.tableSettings.getUpdatedColumns() : this.columns,
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    },
                    plugins: [
//                        new PinColumns(),
                        new SortableHeader(),
                        new StickyScrollbar(),
                        new ResizableHeader()
                    ]
                });

                this.forceXHR = false;

                if(restoreStatus)
                    this.restoreStatus();

                // Configure widgets
                this.showRows.configure({
                    paginatedTable: this.paginatedTable
                });

                selectAllNotification.configure({
                    paginatedTable: this.paginatedTable
                });

            // Add listeners for owning widgets
            this.addEventHandlers();

            // Attach table widget to region
            this.paginatedTable.attachTo(this.view.getTable());
        },

        getTable: function() {
            return this.paginatedTable;
        },

        refreshDataNeeded: function() {
            if (this.selectedRows[0]) {
                if ( jquery('.elLayouts-Wrapper').length !== 0 &&
                     jquery('.elLayouts-Wrapper').queue().length === 0 &&
                     jquery(".ebTableRow_highlighted").length !== 0 ) {
                    jquery('.elLayouts-Wrapper').animate({ scrollTop: jquery(".ebTableRow_highlighted").offset().top - 80 }, 800);
                }
            }

             this.selectedRows.forEach(function(row) {
                if ( profileSummaryPanels[row.username] ) {
                    this.getEventBus().publish('profilesummary:roles-' + row.username);
                }
            }.bind(this));

            this.forceXHR = true;
        },

        addEventHandlers: function() {
            this.paginatedTable.addEventHandler('pageloaded', function(queryParams, history) {
                this.triggerContextActions(this.paginatedTable.getCheckedRows());
                this.refreshDataNeeded();
                queryParams.federated = this.options.isFederatedView;
                this.queryParams = queryParams;
                this.getEventBus().publish('locationcontroller:updatequeryparams', queryParams, history);

                if (this.paginatedTable && this.savedUser ) {
                    var rowSavedUser = this.paginatedTable.getRows().findIndex( function(user) {
                                                                        return user.username === this.savedUser;
                                                                     }.bind(this));

                    var pageWithSavedUser = Math.ceil(rowSavedUser / this.showRows.getValue().value);
                    this.paginatedTable.getPageData( pageWithSavedUser, true, true);
                    this.checkSavedUser = this.savedUser;

                    this.savedUser = undefined;
                } else if (this.paginatedTable && this.checkSavedUser ) {
                    this.paginatedTable.checkRowByUniqueId(this.checkSavedUser);
                    this.checkSavedUser = undefined;
                }

            }.bind(this));

            this.paginatedTable.addEventHandler('checkend', this.triggerContextActions.bind(this));
        },

        setSavedUser: function(user) {
            this.savedUser = user;
        },

        addSubscribtions: function() {
            var eventBus = this.getEventBus();

            this.subscribeIds['locationcontroller:queryparamsupdated'] = eventBus.subscribe('locationcontroller:queryparamsupdated', function(queryParams) {
                if (this.paginatedTable) {
                    this.paginatedTable.setQueryParams(queryParams, this.forceXHR);
                }
                this.forceXHR = false;
            }.bind(this));


            this.subscribeIds['layouts:panelaction'] = eventBus.subscribe('layouts:panelaction', function(value) {
                if (value === 'notifications') {
                    this.showNotificationsFlyout();
                }
            }.bind(this));

            if ( !this.options.isFederatedView ) {
                this.subscribeIds['action:forcePasswordChange'] = eventBus.subscribe('action:forcePasswordChange', this.forcePasswordShowResult.bind(this));
                this.subscribeIds['action:enableDisableUser'] = eventBus.subscribe('action:enableDisableUser', this.enableDisableUser.bind(this));
                this.subscribeIds['action:deleteUsers'] = eventBus.subscribe('action:deleteUsers', this.showConfirmationDeleteUsersDialog.bind(this));
                this.subscribeIds['action:export'] = eventBus.subscribe('action:export', this.exportProfiles.bind(this));
                this.subscribeIds['action:importUsers'] = eventBus.subscribe('action:importUsers', this.importUsers.bind(this));

                this.subscribeIds['action:editProfile'] = eventBus.subscribe('action:editProfile', function() {
                    this.paginatedTable.view.showLoader();
                    if (this.selectedRows.length === 1) {
                        window.location.hash = "usermanagement/usermgmtprofile/edit/" + this.selectedRows[0].username;
                    } else {
                        window.location.hash = "usermanagement/usersgroupedit/?users=" + this.selectedRows.map(function(row) {
                            return row.username;
                        });
                    }
                }.bind(this));

                this.subscribeIds['action:duplicateProfile'] = eventBus.subscribe('action:duplicateProfile', function() {
                    this.paginatedTable.view.showLoader();
                    window.location.hash = "usermanagement/usermgmtprofile/duplicate/" + this.selectedRows[0].username;
                }.bind(this));

                this.subscribeIds['action:create'] = eventBus.subscribe('action:create', function() {
                    this.paginatedTable.view.showLoader();
                    window.location.hash = "usermanagement/usermgmtprofile/create";
                }.bind(this));
            }

            this.subscribeIds['action:terminateSessions'] = eventBus.subscribe('action:terminateSessions', this.terminateSessionsShowResult.bind(this));
            this.subscribeIds['action:revokeCertificate'] = eventBus.subscribe('action:revokeCertificate', this.revokeCertificate.bind(this));
            this.subscribeIds['action:viewSummary'] = eventBus.subscribe('action:viewSummary', this.profileSummaryTrigger.bind(this));
            this.subscribeIds['profilesummary:terminatesessions'] = eventBus.subscribe('profilesummary:terminatesessions', function() {
                //reset sessionPromises for new load of session Instances
                if (profileSummaryPanels.length) {
                    refreshSessions.call(this);
                }
            }.bind(this));

            this.subscribeIds['action:changePasswordByAdmin'] = eventBus.subscribe('action:changePasswordByAdmin', function() {
                this.paginatedTable.view.showLoader();
                window.location.hash = "usermgmtchangepass/user/" + this.selectedRows[0].username;
            }.bind(this));
        },

        removeSubscribtions: function() {
            var eventBus = this.getEventBus();

            if (this.multiSlidingPanel.isShown('right')) {
              this.visiblePanel = 'none';
              eventBus.publish('layouts:closerightpanel', function() {
              });
            }

            eventBus.unsubscribe('locationcontroller:queryparamsupdated', this.subscribeIds['locationcontroller:queryparamsupdated']);

            eventBus.unsubscribe('layouts:panelaction', this.subscribeIds['layouts:panelaction']);

            if ( !this.options.isFederatedView ) {
                eventBus.unsubscribe('action:forcePasswordChange', this.subscribeIds['action:forcePasswordChange']);
                eventBus.unsubscribe('action:deleteUsers', this.subscribeIds['action:deleteUsers']);
                eventBus.unsubscribe('action:export', this.subscribeIds['action:export']);
                eventBus.unsubscribe('action:importUsers', this.subscribeIds['action:importUsers']);
                eventBus.unsubscribe('action:editProfile', this.subscribeIds['action:editProfile']);
                eventBus.unsubscribe('action:duplicateProfile', this.subscribeIds['action:duplicateProfile']);
                eventBus.unsubscribe('action:create', this.subscribeIds['action:create']);
            }

            eventBus.unsubscribe('action:terminateSessions', this.subscribeIds['action:terminateSessions']);
            eventBus.unsubscribe('action:revokeCertificate', this.subscribeIds['action:revokeCertificate']);
            eventBus.unsubscribe('action:viewSummary', this.subscribeIds['action:viewSummary']);
            eventBus.unsubscribe('profilesummary:terminatesessions', this.subscribeIds['profilesummary:terminatesessions']);
            eventBus.unsubscribe('action:changePasswordByAdmin', this.subscribeIds['action:changePasswordByAdmin']);
        },

        triggerContextActions: function(checkedRows) {
            this.selectedRows = checkedRows || [];
            var checkedRowsNumber = checkedRows.length;
            var actions;

            if (checkedRowsNumber === 0) {
                this.getEventBus().publish('topsection:leavecontext');
            } else {
                actions = ActionsManager.getActions(this.selectedRows, true);
                this.getEventBus().publish('topsection:contextactions', actions);
            }

            if ( this.multiSlidingPanel.isShown('right') && this.visiblePanel === 'profileSummary') {
                this.updateProfileSummary();
            }
        },

        profileSummaryTrigger: function() {
            if (this.multiSlidingPanel.isShown('right')) {
                if (this.visiblePanel === 'profileSummary') {
                  this.visiblePanel = 'none';
                  this.getEventBus().publish('layouts:closerightpanel');
                } else {
                  this.visiblePanel = 'profileSummary';
                  this.getEventBus().publish('layouts:showpanel', getProfileSummary.call(this));
                }
            } else {
                this.visiblePanel = 'profileSummary';
                this.getEventBus().publish('layouts:showpanel', getProfileSummary.call(this));
            }
        },

        importUsers: function() {
            var fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('accept', 'text/xml');

            fileInput.onchange = function(fileInput) {
                var file = fileInput.files[0];
                var data = new FormData();
                data.append("usersFile", file);
                this.showLoadingFileDialog(xhr);
                var xhr = UserManagementService.uploadUsersFile(data, function(response, xhr) {
                    //additional function because this.uploadingFileDialog has to be defined after this call of uploadUsersFile
                    this.uploadingFileDialog.hide();
                    responseHandler.setNotification({
                        response: {
                            xhr: xhr
                        },
                        dialog: true,
                        operation: "parseFile"
                    });
                }.bind(this));
            }.bind(this, fileInput);

            fileInput.click();
        },

        showLoadingFileDialog: function(xhr) {
            this.uploadingFileDialog = new UploadingFileDialog({
                xhr: xhr,
                owner: this.loggedUser
            });
            this.uploadingFileDialog.show();
        },

        showNotificationsFlyout: function() {
            container.getEventBus().publish('flyout:show', {
                header: Dictionary.notificationsHeader,
                content: this.notificationsFlyout
            });
        },

        updateProfileSummary: function() {
            this.getEventBus().publish('layouts:showpanel', getProfileSummary.call(this));
        },

        forcePasswordShowResult: function(resetFlagValue) {
            showLoader();
            var requests = this.selectedRows.map(function(row) {
                return new Promise(function(resolve, reject) {
                    UserManagementService.setForcePasswordChange(row.username, resetFlagValue).then(resolve, resolve);
                });
            });

            Promise.all(requests).then(function(responses) {
                hideLoader();

                var allSuccess = !responses.some(function(response) {
                    return (response.singleNotification === undefined);
                });

                if (allSuccess) {
                    responseHandler.setNotificationSuccess({ response: (( resetFlagValue === "true") ? "success_force_password_change" : "success_unforce_password_change")});
                } else {
                    responseHandler.setNotification({
                        response: responses,
                        operation: "forcePasswordChange",
                        dialog: true
                    });
                }
                this.paginatedTable.refreshData();
            }.bind(this));
        },

         enableDisableUser: function(statusValue) {
             showLoader();
             var requests = this.selectedRows.map(function(row) {
                 return new Promise(function(resolve, reject) {
                     UserManagementService.setEnableDisableUser(row.username, statusValue).then(resolve, resolve);
                 });
             });

             Promise.all(requests).then(function(responses) {
                 hideLoader();

                 var allSuccess = !responses.some(function(response) {
                     return (response.singleNotification === undefined);
                 });

                 if (allSuccess) {
                     responseHandler.setNotificationSuccess({ response: (( statusValue === "true") ? "success_enable_user_change" : "success_disable_user_change")});
                 } else {
                     responseHandler.setNotification({
                         response: responses,
                         operation: "enableDisableUser",
                         dialog: true
                     });
                 }
                 this.paginatedTable.refreshData();
             }.bind(this));
         },

        terminateSessionsShowResult: function() {
            showLoader();

            var requests = this.selectedRows.map(function(row) {
                return new Promise(function(resolve, reject) {
                    UserManagementService.setTerminateSessions(row.username).then(resolve, resolve);
                });
            });

            Promise.all(requests).then(function(responses) {
                //refresh users sessions just when View Summary panel has been clicked at least for one user
                this.getEventBus().publish('profilesummary:terminatesessions');
                this.paginatedTable.refreshData();
                hideLoader();

                var allSuccess = !responses.some(function(response) {
                    return (response.singleNotification === undefined);
                });

                if (allSuccess) {
                    responseHandler.setNotificationSuccess({ response: "success_terminate_sessions" });
                } else {
                    responseHandler.setNotification({ response: responses });
                }
            }.bind(this));

        },

        revokeCertificate: function() {
            showLoader();
            var requests = this.selectedRows.map(function(row) {
                return new Promise(function(resolve, reject) {
                    UserManagementService.requestRevokeCertificate(row.username).then(resolve, resolve);
                });
            });

            Promise.all(requests).then(function(responses) {
                //refresh users list
                this.paginatedTable.refreshData();
                hideLoader();

                var allSuccess = !responses.some(function(response) {
                    return (response.singleNotification === undefined);
                });

                if (allSuccess) {
                    responseHandler.setNotificationSuccess({ response: "success_revoke_certificate" });
                } else {
                    responseHandler.setNotification({ response: responses });
                }
            }.bind(this));
        },

        showConfirmationDeleteUsersDialog: function() {
            container.getEventBus().publish('container:loader');
            var confirmationDeleteUsersDialog = new ConfirmationDeleteUsersDialog();
            confirmationDeleteUsersDialog.showConfirmationDeleteUsersDialog(this.selectedRows);
            confirmationDeleteUsersDialog.addEventHandler('hideLoader', function() {
                container.getEventBus().publish('container:loader-hide');
            });
            confirmationDeleteUsersDialog.addEventHandler('showLoader', function() {
                container.getEventBus().publish('container:loader');
            });
            //after delete user
            confirmationDeleteUsersDialog.addEventHandler('deletedUsers', function() {
                this.paginatedTable.clearAll();
                this.paginatedTable.refreshData();
                container.getEventBus().publish('container:loader-hide');
                this.getEventBus().publish('layouts:closerightpanel');
                this.getEventBus().publish('topsection:leavecontext'); // Force Update Actions
            }.bind(this));
        },

        exportProfiles: function() {
            if (this.paginatedTable.getCheckedRows().length <= maximumUsersNrAvailableToBeExported) {
                showLoader();
                this.dataHandler.fetchData({ export: true })
                    .then(function(fetchedUsers) {
                        hideLoader();
                        this.paginatedTable.updateCheckedRowsData();
                        UsersExport.createReportXML(this.paginatedTable.getCheckedRows());
                        responseHandler.setNotificationSuccess({ response: Dictionary.successful_export });
                    }.bind(this));
            } else {
                var exportingProfilesDialog = new ExportingProfilesDialog(this);
                exportingProfilesDialog.show();
            }
        },

        startWebpushImportChannels: function() {
            if ( this.options && this.options.isFederatedView===true ) {
                UserManagementService.getLoggedUsername().then(function(loggedUser) {
                    this.loggedUser = loggedUser.username;
                    this.notificationsFlyout = new NotificationsFlyout({
                        loggedUser: this.loggedUser
                    });
                }.bind(this));
            } else {
                UserManagementService.getLoggedUsername().then(function(loggedUser) {
                    webpush.enable();
                    this.loggedUser = loggedUser.username;
                    this.notificationsFlyout = new NotificationsFlyout({
                        loggedUser: this.loggedUser
                    });
                    this.expandedImportNotification = new ExpandedImportNotification({
                        loggedUser: this.loggedUser
                    });
                    this.expandedImportNotification.addEventHandler('refresh', function() {
                        this.paginatedTable.refreshData();
                    }.bind(this));
                    this.expandedImportNotification.addEventHandler('showNotifications', function() {
                        this.showNotificationsFlyout();
                    }.bind(this));
                    this.notificationsFlyout.addEventHandler('close', function() {
                        var type = this.expandedImportNotification.getType();
                        if (type === "FINISHED" || type === "FINISHED_WITH_ERROR" || type === "PARTIAL_SUCCESS") {
                            this.expandedImportNotification.detachNotification();
                        }
                    }.bind(this));
                    this.expandedImportNotification.attachTo(this.view.getNotification());
                    _subscribeToWebpushImportChannel.call(this);
                }.bind(this));
            }
        },

        showImportAnalysis: function(analysis) {
            if (this.analysisDialog) {
                return;
            }
            this.analysisDialog = new AnalysisDialog({
                analysisResult: analysis.result,
                importId: analysis.importId
            });
            this.analysisDialog.show();
            this.analysisDialog.addEventHandler('hide', function() {
                this.analysisDialog = null;
            }.bind(this));
        }
    });

});
