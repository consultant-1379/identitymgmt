define([
    "tablelib/Cell",
    'uit!./rolenamecell.html',
    '../../Dictionary'
], function(Cell, View, Dictionary) {

    return Cell.extend({

        View: View,

        setValue: function(name) {
          
            var model = this.getRow().getData().model;

            //for TAF Test XPATH
            this.view.getElement().setAttribute('id', "TD_TG_ASSIGN_ROLENAME_" + name);
          
            this.view.getElement().find('.eaUsermgmtlib-cRoleNameCell-roleName').setText(name);
            // add edit link to all roles but application and system
            if (model.get('type') !== 'application' && model.get('type') !== 'system' && model.get('action') !== 'unassign') {
                this.view.getElement().find('.eaUsermgmtlib-cRoleNameCell-link-a').setText(Dictionary.roleTable.edit_role_link);
                this.view.getElement().find('.eaUsermgmtlib-cRoleNameCell-link-a').setAttribute('href', '#rolemanagement/userrole/edit/' + name);
            }
        }
    });
});