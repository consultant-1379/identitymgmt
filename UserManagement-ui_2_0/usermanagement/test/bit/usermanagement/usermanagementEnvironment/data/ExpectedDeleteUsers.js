define(function () {
    'use strict';

    var deleteusers = [];
    var oneactiveuser = [];
    var oneinactiveuser = [];



    deleteusers.push({
        'columns': ['operatornotsecurityadmin', 'Active']
    });
    deleteusers.push({
        'columns': ['securityadminuser', 'Inactive']
    });

    oneactiveuser.push({
        'columns': ['operatornotsecurityadmin', 'Active']
    });
    oneinactiveuser.push({
        'columns': ['securityadminuser', 'Inactive']
    });

    var users = {
        'deleteusers': deleteusers,
        'oneactiveuser': oneactiveuser,
        'oneinactiveuser': oneinactiveuser

    };


    return users;

});
