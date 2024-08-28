define([
	'identitymgmtlib/mvp/binders/TextBinder',
	'identitymgmtlib/mvp/binders/WidgetBinder',
	'identitymgmtlib/mvp/binders/ModifierBinder',
	'identitymgmtlib/mvp/binders/ValueModifierBinder',
    'identitymgmtlib/mvp/binders/BooleanModifierBinder',
    'identitymgmtlib/mvp/binders/CheckboxBinder'
], function(TextBinder, WidgetBinder, ModifierBinder, ValueModifierBinder, BooleanModifierBinder, CheckboxBinder) {
    return {
    	TextBinder: TextBinder,
        WidgetBinder: WidgetBinder,
        ModifierBinder: ModifierBinder,
        ValueModifierBinder: ValueModifierBinder,
        BooleanModifierBinder: BooleanModifierBinder,
        CheckboxBinder: CheckboxBinder
    };
});