define([
    'usermgmtchangepass/Dictionary',

], function (i18n_app, i18n_common, Utils) {
    'use strict';

    describe('Dictionary', function () {

        it('i18n_app', function () {
            expect(i18n_app).not.to.be.undefined;
        });


        it('i18n_common', function () {
            expect(i18n_common).to.be.undefined;
        });


        it('Utils', function () {
            expect(Utils).to.be.undefined;
        });

    });

});
