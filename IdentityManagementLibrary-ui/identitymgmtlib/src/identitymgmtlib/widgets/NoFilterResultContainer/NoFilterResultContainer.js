define([
    'jscore/core',
    'uit!./NoFilterResultContainer.html',
    'jscore/ext/privateStore',
    'i18n!identitymgmtlib/common.json',
    'widgets/InlineMessage'
], function(core, View, PrivateStore, DictionaryCommon, InlineMessage) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        view: function() {
            return new View();
        },

        onViewReady: function() {
            _(this).inlineMessage = new InlineMessage({
                icon: 'infoMsgIndicator',
                header: DictionaryCommon.filterNoResult.title,
                description: DictionaryCommon.filterNoResult.info
            });
            _(this).inlineMessage.attachTo(this.view.getElement().find('.elIdentitymgmtlib-NoFilterResultContainer-message'));
        }
    });

});
