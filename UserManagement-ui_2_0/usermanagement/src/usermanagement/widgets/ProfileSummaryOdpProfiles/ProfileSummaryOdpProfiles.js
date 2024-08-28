define([
    'jscore/core',
    'jscore/ext/privateStore',
    './ProfileSummaryOdpProfilesView',
    'identitymgmtlib/mvp/binding',
    'tablelib/Table',
    'identitymgmtlib/Utils',
    '../../Dictionary',
    'jscore/ext/utils/base/underscore'
], function(core, PrivateStore, View, binding, Table, Utils, Dictionary, underscore) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        View: View,

        odpProfiles: [],

        onViewReady: function() {

            this.userOdpProfiles = this.options.userOdpProfiles;
            this.odpProfiles = this.options.odpProfiles;

            var tableOptions = this.buildTableOptions(),
                tableW = new Table(tableOptions);
            tableW.attachTo(this.getElement());
        },

        buildTableOptions: function () {

              var odpValues = [];

              this.odpProfiles.forEach(function (item) {
                   var odpValue = {applicationName: item.applicationName};
                   var userOdpProfile;
                   if (this.userOdpProfiles) {
                     userOdpProfile = this.userOdpProfiles.find(function (e) {
                           return e.applicationName.toLowerCase() === item.applicationName.toLowerCase(); }.bind(this)
                     );
                   }
                   if (userOdpProfile)
                       odpValue.profileName = userOdpProfile.profileName;
                   else
                       odpValue.profileName = Dictionary.odpDefaultProfile;
                   odpValues.push(odpValue);
              }.bind(this));

              return {
                  data: odpValues,
                  columns: [
                      {title: Dictionary.odpTable.columns.name, attribute: 'applicationName'},
                      {title: Dictionary.odpTable.columns.profile, attribute: 'profileName'}
                  ],
                  plugins: [],
                  modifiers: [
                      {name: 'striped'} // Applying a different table style
                  ]
              };
        }

    });

});
