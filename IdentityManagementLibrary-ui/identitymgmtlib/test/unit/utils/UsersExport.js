define([
    'identitymgmtlib/utils/UsersExport',
], function(UsersExport) {
    'use strict';

    describe("UsersExport", function() {

        it('UsersExport should be defined', function() {
            expect(UsersExport).not.to.be.undefined;
        });

        // it('UsersExport should escape illegal chars', function() {
        //     var sandbox = sinon.sandbox.create();
        //     var downloadReportFake = function(report, format) {
        //         console.log("provapaola");
        //         console.log(report);
        //         console.log(report.includes('>'));
        //     	expect(report.includes('>')).to.equal(false);
        //     	expect(report.includes('<')).to.equal(false);
        //     	expect(report.includes('\&')).to.equal(false);
        //     	expect(report.includes('\"')).to.equal(false);
        //     }

        //     //UsersExport.downloadReport = downloadReportFake;
        //     sandbox.spy(UsersExport.createReportXML, 'convertArrayOfObjectsToXML');

        //     var userData = [{"username":"provapaola","password":"********","status":"enabled","name":"<paola2&>","surname":"<paola2&>","email":"","description":"<paola2&>&&&&<<<<<>>>>>>>&&&&,<<<","previousLogin":null,"lastLogin":null,"passwordResetFlag":false,"privileges":[],"passwordChangeTime":"20190508145536+0000","maxSessionTime":null,"maxIdleTime":null,"authMode":"local","failedLogins":0,"passwordAgeing":null},{"username":"administrator","password":"********","status":"enabled","name":"security","surname":"admin","email":"security@administrator.com","description":"","previousLogin":"20190508153345+0000","lastLogin":"20190508160530+0000","passwordResetFlag":false,"privileges":[],"passwordChangeTime":"20190504160855+0000","maxSessionTime":null,"maxIdleTime":null,"authMode":"local","failedLogins":0,"passwordAgeing":null}];

        //     UsersExport.createReportXML(userData);
        //     console.log(UsersExport.createReportXML().convertArrayOfObjectsToXML.getCall(0).args[0]);

        // });

    });
});