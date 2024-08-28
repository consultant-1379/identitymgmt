define([
    'identitymgmtlib/mvp/Model'
], function(Model) {

    return Model.extend({

        idAttribute: "name",

        parse: function(data) {
            if (data.value === 0) {
                data.value = '';
            }
            return data;
        }
    });
});
