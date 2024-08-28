define([
    "tablelib/Cell",
    'uit!./checkboxcell.html',
    'identitymgmtlib/mvp/binding'
], function(Cell, View, binding) {



    var updateCheckbox = function(model) {
        var checkbox = this.view.getElement().find('.eaUsermgmtlib-cCheckboxCell-ebInput');
        if (model.get('assigned')) {
            if(model.get('action') === 'assign'){
                checkbox.setProperty("checked","checked");
            }else {
                checkbox.setProperty("checked","");
            }
        } else {
            if(model.get('action') === 'assign'){
               checkbox.setProperty("checked","");
            }else {
                checkbox.setProperty("checked","checked");
            }
        }
    };

    return Cell.extend({

        View: View,

        setTooltip: function () {
            this.getElement().removeAttribute('title');
        },

        setValue: function(model) {
            //for TAF Test XPATH
            this.view.getElement().setAttribute('id', "TD_TG_ASSIGN_ICON_" + model.get('name'));

            // udpate icon handler
            model.addEventHandler('change:assigned', function() {
                updateCheckbox.call(this, model);
            }.bind(this));
            updateCheckbox.call(this, model);

            // click icon handler
            this.view.getElement().find('.eaUsermgmtlib-cCheckboxCell-ebInput').addEventHandler('click', function() {
                model.setAttribute('assigned', model.getAttribute('assigned') ? false : true);
                // TODO: setTouched shuold be handled in auto way
                model.setTouched('assigned');
            }.bind(this));

        }
    });
});