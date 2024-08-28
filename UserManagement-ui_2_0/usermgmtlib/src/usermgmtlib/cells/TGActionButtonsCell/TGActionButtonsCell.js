define([
    'container/api',
    "tablelib/Cell",
    'uit!./tgactionbuttonscell.html',
    'identitymgmtlib/mvp/binding',
    '../../Dictionary',
    '../../widgets/AssignTGFlyout/AssignTGFlyout',
    '../../widgets/UnassignTGFlyout/UnassignTGFlyout',
    "widgets/Button",
    'identitymgmtlib/Utils',
    'widgets/InfoPopup'
], function(apiContainer, Cell, View, binding, Dictionary, assignTargetGroupPanel, unassignTargetGroupPanel, Button, Utils, InfoPopup ) {

    var createButtonWidget = function(model) {
        this.buttonWidget = new Button({
           caption: /*(model.get('action') === 'unassign') ? Dictionary.targetGroupPanel.flyPanelButtonUnassign : */ getElementAssignedTgs(Dictionary.targetGroupPanel.comTGButton, model)
        });
    };

    var createCppButtonWidget = function(model) {
        this.buttonWidget = new Button({
           caption: getElementAssignedTgs(Dictionary.targetGroupPanel.cppTGButton, model)
        });
    };

    var addEventHandlerTGPanel = function(model, operation){
        this.buttonWidget.addEventHandler('click', function() {
            operation.setEventBus(apiContainer.getEventBus());
            operation.setModel(model);
            if(Utils.isComRole(model)){
                apiContainer.getEventBus().publish("flyout:show", {
                    header:  (model.get('action') === 'unassign') ? Dictionary.targetGroupPanel.titleUnassign : Dictionary.targetGroupPanel.titleComTG,
                    content: operation,
                    width: "60vw"
                });
            } else  {
                apiContainer.getEventBus().publish("flyout:show", {
                    header:  (model.get('action') === 'unassign') ? Dictionary.targetGroupPanel.titleCppUnassign : Dictionary.targetGroupPanel.titleCppTG,
                    content: operation,
                    width: "60vw"
                });
            }
        }.bind(this));
    };

    var addEventHandler = function(model) {
        if(model.get('action') === 'unassign'){
            addEventHandlerTGPanel.call(this,model, unassignTargetGroupPanel);
        } else {
            addEventHandlerTGPanel.call(this,model, assignTargetGroupPanel);
        }
    };

    var getElementAssignedTgs = function(header, model) {
        if ( !model.get('tgsChanged' )) {
            return Utils.printf( header, "-");
        }
        return Utils.printf( header, Utils.getAssignedTgsValue.call(this, model));
    };

    var setViewElementAssignedTgs = function(model) {
        if ( this.infoPopup ) {
            this.infoPopup.detach();
        }

        this.view.getElement().find(".eaUsermgmtlib-cTGActionButtonsCell-tgs" ).setText("");

//        if (model.get('assigned') === true ) {
//            this.infoPopup = new InfoPopup({
//                content: Dictionary.targetGroupPanel.info
//            });
//            this.infoPopup.attachTo(this.getElement().find('.eaUsermgmtlib-cTGActionButtonsCell-infoIconBox'));
//
//            this.view.getElement().find(".eaUsermgmtlib-cTGActionButtonsCell-tgs" ).setText(getElementAssignedTgs(Dictionary.targetGroupPanel.service, model));
//        } else {
//            //TODO Uncomment when Unassign TGs will be managed
////            if ( model.get('action') === 'unassign' ) {
////                this.infoPopup.attachTo(this.getElement().find('.eaUsermgmtlib-cTGActionButtonsCell-infoIconBox'));
////                this.view.getElement().find(".eaUsermgmtlib-cTGActionButtonsCell-tgs" ).setText(getElementAssignedTgs(Dictionary.targetGroupPanel.service, model));
////            } else {
//                this.view.getElement().find(".eaUsermgmtlib-cTGActionButtonsCell-tgs" ).setText("");
////            }
//        }
    };


    return Cell.extend({
        View: View,

        setValue: function(model) {

            //for TAF Test XPATH
            this.view.getElement().setAttribute('id',
                    ((model.get('action') === 'unassign') ? "TD_TG_UNASSIGN_BUTTON_" : "TD_TG_ASSIGN_BUTTON_") + model.get('name'));

            if(Utils.isServiceRole(model)) {
                model.addEventHandler("change:tgsChanged", function() {
                    setViewElementAssignedTgs.call(this, model);
                }.bind(this));

                model.addEventHandler("change:tgs", function() {
                    setViewElementAssignedTgs.call(this, model);
                }.bind(this));

                model.addEventHandler("change:assigned", function(eventData) {
                    setViewElementAssignedTgs.call(this, model);
                }.bind(this));

                setViewElementAssignedTgs.call(this, model);

// Dopo il mergione
//                if ( this.isTargetGroupNone(model) && model.get('action') === 'unassign') {
//                    this.buttonWidget.disable();
//                }

            } else if(Utils.isComRole(model)){

                createButtonWidget.call(this, model);
                this.buttonWidget.attachTo(this.view.getElement().find('.eaUsermgmtlib-cTGActionButtonsCell-buttonContainer'));

                this.setCorrectState(model);
                addEventHandler.call(this, model);

                model.addEventHandler("change:assigned", function(eventData) {
                    this.setCorrectState(eventData);
                }.bind(this));

                model.addEventHandler("change:tgs", function() {
                   this.buttonWidget.setCaption( getElementAssignedTgs(Dictionary.targetGroupPanel.comTGButton, model) );
                }.bind(this));

                model.addEventHandler("change:tgsChanged", function() {
                    this.buttonWidget.setCaption( getElementAssignedTgs(Dictionary.targetGroupPanel.comTGButton, model) );
                }.bind(this));


                if ( this.isTargetGroupNone(model) && model.get('action') === 'unassign') {
                    this.buttonWidget.disable();
                }
            } else {
                createCppButtonWidget.call(this, model);
                this.buttonWidget.attachTo(this.view.getElement().find('.eaUsermgmtlib-cTGActionButtonsCell-buttonContainer'));

                this.setCorrectState(model);
                addEventHandler.call(this, model);

                model.addEventHandler("change:assigned", function(eventData) {
                    this.setCorrectState(eventData);
                }.bind(this));

                model.addEventHandler("change:tgs", function() {
                   this.buttonWidget.setCaption( getElementAssignedTgs(Dictionary.targetGroupPanel.cppTGButton, model) );
                }.bind(this));

                model.addEventHandler("change:tgsChanged", function() {
                    this.buttonWidget.setCaption( getElementAssignedTgs(Dictionary.targetGroupPanel.cppTGButton, model) );
                }.bind(this));


                if ( this.isTargetGroupNone(model) && model.get('action') === 'unassign') {
                    this.buttonWidget.disable();
                }
            }

        },

        setCorrectState: function(model) {

            if(model.get('action') === 'unassign'){
                if (model.get('assigned') === true && !this.isTargetGroupNone(model) ) {
                   this.buttonWidget.enable();
                }else {
                   this.buttonWidget.disable();
                }
            }else {
                if (model.get('assigned') === true ) {
                   this.buttonWidget.enable();
                }else {
                   this.buttonWidget.disable();
                }
            }
        },
        isTargetGroupNone: function(model) {
            var tgs = model.get('tgs');
            if ( tgs !== undefined && tgs.length === 1 && tgs[0] === "NONE" ) {
                return true;
            }
            return false;
        },


    });
});
