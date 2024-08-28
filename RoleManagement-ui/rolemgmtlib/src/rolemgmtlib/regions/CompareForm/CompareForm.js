define([
  'jscore/core',
  'jscore/ext/binding',
  './CompareFormView',
  'widgets/Tooltip',
  'i18n!rolemgmtlib/dictionary.json',
  'widgets/Notification',
  'widgets/ExpandableList',
  'identitymgmtlib/Utils'
], function(core, binding, View, Tooltip, Dictionary, Notification, ExpandableList, Utils) {


  return core.Region.extend({

    View: View,
    Utils: Utils,

    onStart: function() {

      this.view.setRoleName("" + this.options.role1, 1);
      this.view.setRoleName("" + this.options.role2, 2);

    },

    onViewReady: function() {
      if(Utils.isNotNullEmptyOrUndefined(this.options.role1)) {
        this.options.model1.fetch({
          success: function(model1) {
            this.actionsRole1 = this.getActionsObject(this.options.model1);
            this.updateView1();
            if (this.actionsRole2 !== undefined) {
              this.deleteSameActions();
              this.updateActionsForRoles();
            }
          }.bind(this),
          error: function(model, status) {
            this.view.setRoleName(Utils.printf(Dictionary.compareRoleForm.noRoleTittle, this.options.role1), 1);

            if (status.getStatus() === 404 || status.getStatus() === "404") {
              this.showErrorMessage(Utils.printf(Dictionary.compareRoleForm.noRoleMessage, this.options.role1));
            } else {
              this.showErrorMessage(Utils.printf(Dictionary.compareRoleForm.noRoleExist, this.options.role1) + Utils.printf(Dictionary.compareRoleForm.noRoleExistErrorNumber, status.getStatus()));
            }
            this.failureNotification.attachTo(this.getElement());
          }.bind(this)
        });
      }

      if (Utils.isNotNullEmptyOrUndefined(this.options.role2)) {
        this.options.model2.fetch({
          success: function(model2) {
            this.actionsRole2 = this.getActionsObject(this.options.model2);
            this.updateView2();
            if (this.actionsRole1 !== undefined) {
              this.deleteSameActions();
              this.updateActionsForRoles();
            }
          }.bind(this),
          error: function(model, status) {
            this.view.setRoleName(Utils.printf(Dictionary.compareRoleForm.noRoleTittle, this.options.role2), 2);
            if (status.getStatus() === 404 || status.getStatus() === "404") {
              this.showErrorMessage(Utils.printf(Dictionary.compareRoleForm.noRoleMessage, this.options.role2));
            } else {
              this.showErrorMessage(Utils.printf(Dictionary.compareRoleForm.noRoleExist, this.options.role2, status.getStatus()) + Utils.printf(Dictionary.compareRoleForm.noRoleExistErrorNumber, status.getStatus()));
            }
            this.failureNotification.attachTo(this.getElement());
          }.bind(this)
        });
      }
    },

    setActionsMessage: function(number) {
      var elementInfo = new core.Element('div');
      this.view.getAction(number).append(elementInfo);
      elementInfo.setAttribute('class', 'ebIcon ebIcon_infoMsgIndicator');
      var element = new core.Element('span');
      this.view.getAction(number).append(element);
      element.setText(Dictionary.compareRoleForm.noContrastingActions);
    },

    deleteSameActions: function() {
      this.diffActionsRole1 = this.diffArray(this.actionsRole1, this.actionsRole2);
      this.diffActionsRole2 = this.diffArray(this.actionsRole2, this.actionsRole1);
      if (this.diffActionsRole1.length === 0) {
        this.setActionsMessage(1);
      }
      if (this.diffActionsRole2.length === 0) {
        this.setActionsMessage(2);
      }
    },

    diffArray: function(a, b) {

      return a.filter(function(i) {
        return !b.some(function(j) {
          return i.resource === j.resource && i.action === j.action;
        });
      });
    },

    showErrorMessage: function(message) {

      this.failureNotification = new Notification({
        color: 'red',
        icon: 'ebIcon ebIcon_error',
        label: message,
        content: message,
        showCloseButton: true,
        showAsToast: true,
        autoDismiss: false
      });
      this.failureNotification.attachTo(this.getElement());
    },

    getActionsObject: function(model) {
      var actions = model.getActions();
      var arr = [];
      for (var resource in actions) {
        var act = actions[resource];

        for (var i in act) {
          arr.push({
            resource: resource,
            action: act[i]
          });
        }
      }
      return arr;
    },

    updateView1: function() {
      this.view.setDescription(this.options.model1.getDescription(), 1);
      this.view.setStatus(Dictionary.compareRoleForm[this.options.model1.getStatus().toLowerCase()], 1);
    },

    updateView2: function() {
      this.view.setDescription(this.options.model2.getDescription(), 2);
      this.view.setStatus(Dictionary.compareRoleForm[this.options.model2.getStatus().toLowerCase()], 2);
    },

    updateActionsForRoles: function() {
      updateActionForRole.call(this, 1, this.diffActionsRole1);
      updateActionForRole.call(this, 2, this.diffActionsRole2);
    }
  });

  function updateActionForRole(panelId, diffActions) {
      for (var i = 0; i < diffActions.length; i++) {
          var txt = Utils.printf(Dictionary.compareRoleForm.possibleToDoAction, diffActions[i].action, diffActions[i].resource);
          var element = new core.Element('p');
          element.setText(txt);
          element.setStyle('line-height', '80%');
          this.view.getAction(panelId).append(element);
      }
  }
});