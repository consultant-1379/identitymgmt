define([
    'jscore/core',
    'identitymgmtlib/mvp/Model',
    'identitymgmtlib/mvp/Collection',
    'identitymgmtlib/mvp/binders'
], function(core, Model, Collection, binders) {

    var doBindModel = function(view, viewAttribute, model, modelAttribute) {

        var uielement = (view.findById && view.findById(viewAttribute)) || view.getElement().find('#' + viewAttribute);
        var binder = null;

        var binderOptions = {
            uielement: uielement,
            model: model,
            modelAttribute: modelAttribute
        };

        if (uielement && uielement instanceof core.Widget) {
            binder = new binders.WidgetBinder(binderOptions);
            binder.bind();
        } else if (uielement && uielement instanceof core.Element) {
            switch (uielement.getAttribute('bind-type')) {
                case 'modifier':
                    binder = new binders.ModifierBinder(binderOptions);
                    break;
                case 'boolean-modifier':
                    binder = new binders.BooleanModifierBinder(binderOptions);
                    break;
                case 'value-modifier':
                    binder = new binders.ValueModifierBinder(binderOptions);
                    break;
                case 'checkbox':
                    binder = new binders.CheckboxBinder(binderOptions);
                    break;
                default:
                    binder = new binders.TextBinder(binderOptions);
                    break;
            }
            binder.bind();
        } else {
            //throw new Error("Attribute: " + modelAttribute + " cannot be bind with " + viewAttribute);
        }
    };

    var doBindCollection = function(view, view_attribute, collection) {
        throw new Error("Collection binding not implemented yet");
    };

    return {
        bind: function(model, view, bindings) {
            // chose binding method
            var doBind;
            if (model instanceof Model) {
                doBind = doBindModel;
            } else if (model instanceof Collection) {
                doBind = doBindCollection;
            } else {
                doBind = function() {
                    console.error('model should be instance of Model or Collection');
                };
            }


            // bind view with model/collection
            for (var attribute in bindings) {
                if (bindings[attribute] instanceof Array) {
                    for (var inner_attribute in bindings[attribute]) {
                        doBind(view, bindings[attribute][inner_attribute], model, attribute);
                    }
                } else {
                    doBind(view, bindings[attribute], model, attribute);
                }

            }
        }
    };
});
