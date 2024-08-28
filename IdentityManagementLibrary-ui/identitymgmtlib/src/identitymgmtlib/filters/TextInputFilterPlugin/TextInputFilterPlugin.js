define([
    'jscore/core',
    'uit!./textInputFilterPlugin.html',
    'identitymgmtlib/filters/FilterPlugin',
    'jscore/ext/privateStore'
], function(core, View, FilterPlugin, PrivateStore) {

    var _ = PrivateStore.create();

    return FilterPlugin.extend({

        init: function(options) {
            FilterPlugin.prototype.init.call(this, options);
            this.view = new View({
                placeholder: options.placeholder,
                name: this.name,
                title: options.title,
                showTitle: options.showTitle,
            });
        },

        updateValue: function(query) {
            if (query && query[this.name]) {
                _(this).textInput.setValue(query[this.name]);
            } else {
                this.clear();
            }
        },

        onViewReady: function() {
            _(this).textInput = this.view.findById(this.name);
            if (this.applyOnEnter) {
                _(this).textInput.addEventHandler('keydown', _onKeyEvent.bind(this));
            }

            if (this.applyOnChange) {
                _(this).textInput.addEventHandler('change', _triggerApply.bind(this));
            }

            _addIconsUpdateHandlerAndPerformFirstUpdate.call(this);
            _addResetTextOnCloseIconClickHandler.call(this);

            if (this.defaultValue !== undefined) {
                _(this).textInput.setValue(this.defaultValue);
            }
        },

        getData: function() {
            var result = {};
            result[this.name] = _(this).textInput.getValue();
            if (result[this.name]) {
                return result;
            }
        },

        clear: function() {
            _(this).textInput.setValue('');
        }

    });

    function _addResetTextOnCloseIconClickHandler() {
        _getFilterResetIcon.call(this).addEventHandler('click', _onResetTextClick.bind(this));
    }

    function _addIconsUpdateHandlerAndPerformFirstUpdate() {
        _(this).textInput.addEventHandler('input', _updateIconsOnTextChange.bind(this));
        _updateIconsOnTextChange.call(this);
    }

    function _onResetTextClick() {
        _(this).textInput.setValue('');
        _showSearchIcon.call(this);
    }

    function _updateIconsOnTextChange(e) {
        if (_(this).textInput.getValue() === '') {
            _showSearchIcon.call(this);
        } else {
            _hideSearchIcon.call(this);
        }
    }

    function _getFilterSearchIcon() {
        return this.view.getElement().find('.eaIdentitymgmtlib-TextInputFilterPlugin-TextInput-searchIcon');
    }

    function _getFilterResetIcon() {
        return this.view.getElement().find('.eaIdentitymgmtlib-TextInputFilterPlugin-TextInput-closeIcon');
    }

    function _onKeyEvent(e) {
        if (this.applyOnEnter && (e.originalEvent.code === "Enter" || e.originalEvent.key === "Enter")) {
            _triggerApply.call(this);
        }
    }

    function _triggerApply() {
        this.trigger('plugin:apply');
    }

    function _setModifier(element, modifier, value) {
        if (element.hasModifier(modifier)) {
            element.removeModifier(modifier);
        }
        element.setModifier(modifier, value);
    }

    function _showSearchIcon() {
        _setModifier(_getFilterSearchIcon.call(this), 'show', 'true');
        _setModifier(_getFilterResetIcon.call(this), 'show', 'false');
    }

    function _hideSearchIcon() {
        _setModifier(_getFilterSearchIcon.call(this), 'show', 'false');
        _setModifier(_getFilterResetIcon.call(this), 'show', 'true');
    }
});
