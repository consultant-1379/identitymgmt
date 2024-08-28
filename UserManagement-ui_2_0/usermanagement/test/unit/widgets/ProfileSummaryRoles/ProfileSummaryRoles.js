  define([
      'usermanagement/widgets/ProfileSummaryRoles/ProfileSummaryRoles'
      ], function(ProfileSummaryRoles){
          "use strict";

          describe('ProfileSummaryRoles', function() {
              it('ProfileSummaryRoles should be defined', function() {
                  expect(ProfileSummaryRoles).not.to.be.undefined;
                  expect(ProfileSummaryRoles).not.to.be.null;
              });

              it('ProfileSummaryRoles getTgs 1', function() {

                 var privileges = [{role: "Role1", targetGroup: "TG1"}];
                 var roles = [{name: "Role1", type: "application"}];

                 var profileSummaryRoles = new ProfileSummaryRoles({privileges: privileges, roles: roles});

                 var tgs = profileSummaryRoles.tgs;
                 expect(tgs.length).to.be.equal(1);
                 expect(tgs[0]).to.be.equal('TG1');
              });

              it('ProfileSummaryRoles getTgs 2', function() {

                 var privileges = [{role: "Role1", targetGroup: "TG1"},
                                   {role: "Role2", targetGroup: "TG2"},
                                   {role: "Role3", targetGroup: "TG3"}];
                 var roles = [{name: "Role1", type: "application"},
                              {name: "Role2", type: "custom"},
                              {name: "Role3", type: "system"}];

                 var profileSummaryRoles = new ProfileSummaryRoles({privileges: privileges, roles: roles});

                 var tgs = profileSummaryRoles.tgs;
                 expect(tgs.length).to.be.equal(3);
              });

              it('ProfileSummaryRoles getTgs ALL', function() {

                 var privileges = [{role: "Role1", targetGroup: "TG1"},
                                   {role: "Role2", targetGroup: "ALL"},
                                   {role: "Role3", targetGroup: "TG3"}];
                 var roles = [{name: "Role1", type: "application"},
                              {name: "Role2", type: "custom"},
                              {name: "Role3", type: "system"}];

                 var profileSummaryRoles = new ProfileSummaryRoles({privileges: privileges, roles: roles});

                 var tgs = profileSummaryRoles.tgs;
                 expect(tgs.length).to.be.equal(1);
                 expect(tgs[0]).to.be.equal('ALL');
              });

              it('ProfileSummaryRoles getTgs no NONE', function() {

                 var privileges = [{role: "Role1", targetGroup: "TG1"},
                                   {role: "Role2", targetGroup: "NONE"},
                                   {role: "Role3", targetGroup: "TG3"}];
                 var roles = [{name: "Role1", type: "application"},
                              {name: "Role2", type: "custom"},
                              {name: "Role3", type: "system"}];

                 var profileSummaryRoles = new ProfileSummaryRoles({privileges: privileges, roles: roles});

                 var tgs = profileSummaryRoles.tgs;
                 expect(tgs.length).to.be.equal(2);
              });

              it('ProfileSummaryRoles getTgs NONE', function() {

                 var privileges = [{role: "Role1", targetGroup: "NONE"}];
                 var roles = [{name: "Role1", type: "application"}];

                 var profileSummaryRoles = new ProfileSummaryRoles({privileges: privileges, roles: roles});


                 var tgs = profileSummaryRoles.tgs;
                 expect(tgs.length).to.be.equal(1);
                 expect(tgs[0]).to.be.equal('NONE');
              });


              it('ProfileSummaryRoles getTgs no com', function() {

                 var privileges = [{role: "Role1", targetGroup: "TG1"},
                                   {role: "Role2", targetGroup: "NONE"},
                                   {role: "Role3", targetGroup: "TG3"}];
                 var roles = [{name: "Role1", type: "application"},
                              {name: "Role2", type: "com"},
                              {name: "Role3", type: "comalias"}];

                 var profileSummaryRoles = new ProfileSummaryRoles({privileges: privileges, roles: roles});

                 var tgs = profileSummaryRoles.tgs;
                 expect(tgs.length).to.be.equal(1);
                 expect(tgs[0]).to.be.equal('TG1');
              });

              it('ProfileSummaryRoles getTgs 3', function() {

                 var privileges = [{role: "Role1", targetGroup: "TG1"},
                                   {role: "Role2", targetGroup: "TG1"}];
                 var roles = [{name: "Role1", type: "application"},
                              {name: "Role2", type: "system"}];

                 var profileSummaryRoles = new ProfileSummaryRoles({privileges: privileges, roles: roles});


                 var tgs = profileSummaryRoles.tgs;
                 expect(tgs.length).to.be.equal(1);
                 expect(tgs[0]).to.be.equal('TG1');
              });

              it('ProfileSummaryRoles getRoles', function(){

                  var privileges = [{role: "Role1", targetGroup: "TG1"},
                                   {role: "Role2", targetGroup: "TG1"},
                                   {role: "Role3", targetGroup: "TG2"}];
                  var roles = [{name: "Role1", type: "application"},
                              {name: "Role2", type: "system"},
                              {name: "Role3", type: "system"}];
                  var profileSummaryRoles = new ProfileSummaryRoles({privileges: privileges, roles: roles});

                  expect(profileSummaryRoles.privileges.length).to.be.equal(3);
                  expect(profileSummaryRoles.privileges[0].roleName).to.be.equal('Role1');
                  expect(profileSummaryRoles.privileges[1].roleName).to.be.equal('Role2');
              });
          });
      });
