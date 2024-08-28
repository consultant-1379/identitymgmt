define([
    "i18n!usermgmtlib/app.json",
    "i18n!identitymgmtlib/common.json",
    "identitymgmtlib/Utils"
], function (i18n_app, i18n_common, Utils) {
    
    // Creating a single dictionary file, rather than importing all i18n
    // files into multiple different files.
    return Utils.mergeObjects(i18n_app, i18n_common);

});