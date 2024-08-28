/*global define, describe, it, expect */
define([
    'jscore/core',
    'jscore/ext/net',
    'identitymgmtlib/PaginatedTable'
], function(core, net, PaginatedTable) {
    'use strict';

    describe('PaginatedTable', function() {

        //variables
        var sandbox,
            paginatedTable;

        beforeEach(function() {

            //Setup to prepare fake stuffs
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('init', function() {

            it('PaginatedTable should be defined', function() {
                expect(PaginatedTable).not.to.be.undefined;
            });

            it('PaginatedTable should be initialized', function(done) {

                // ARRANGE
                // Setup ajax response for tests
                sandbox.stub(net, 'ajax').yieldsTo('success', [{
                    'username': 'test1'
                }]);

                // ACT
                paginatedTable = new PaginatedTable({
                    title: 'title1',
                    // widgets: {
                    //     showRows: this.showRows,
                    //     selectAllNotification: this.selectAllNotification
                    // },
                    uniqueID: 'username',
                    pageSize: 50,
                    url: '/oss/idm/usermanagement/users',
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: [{
                        title: 'username',
                        attribute: 'username'
                    }, {
                        title: 'status',
                        attribute: 'status'
                    }, {
                        title: 'name',
                        attribute: 'name'
                    }, {
                        title: 'surname',
                        attribute: 'surname'
                    }, {
                        title: 'email',
                        attribute: 'email'
                    }, {
                        title: 'lastLogin',
                        attribute: 'lastLogin'
                    }, {
                        title: 'failedLogins',
                        attribute: 'failedLogins'
                    }],
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    }
                });

                paginatedTable.getPageData(1, true)
                    .then(function() {
                        // VERIFY
                        expect(paginatedTable.getCheckedRows().length).to.equal(0);
                        //expect(paginatedTable.selectedPage).to.equal(1);
                        //expect(paginatedTable.pageSize).to.equal(50);
                        done();
                    })
                    .catch(done);
            });
        });

        describe('checkAll()', function() {
            it('PaginatedTable check all rows', function(done) {

                // ARRANGE
                var data = [];
                for (var i = 0; i < 100; i++) {
                    data.push({
                        'username': 'username' + i,
                        'status': 'status' + i,
                        'name': 'name' + i,
                        'surname': 'surname' + i,
                        'email': 'email' + i,
                        'lastLogin': 'lastLogin' + i,
                        'failedLogins': i
                    });
                }
                sandbox.stub(net, 'ajax').yieldsTo('success', data);

                paginatedTable = new PaginatedTable({
                    uniqueID: 'username',
                    title: 'title1',
                    pageSize: 50,
                    url: '/oss/idm/usermanagement/users',
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: [{
                        title: 'username',
                        attribute: 'username'
                    }, {
                        title: 'status',
                        attribute: 'status'
                    }, {
                        title: 'name',
                        attribute: 'name'
                    }, {
                        title: 'surname',
                        attribute: 'surname'
                    }, {
                        title: 'email',
                        attribute: 'email'
                    }, {
                        title: 'lastLogin',
                        attribute: 'lastLogin'
                    }, {
                        title: 'failedLogins',
                        attribute: 'failedLogins'
                    }],
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    }
                });

                paginatedTable.getPageData(1, true)
                    .then(function() {
                        // ACT
                        paginatedTable.checkAll();

                        // VERIFY
                        expect(paginatedTable.getCheckedRows().length).to.equal(100);
                        //expect(paginatedTable.selectedPage).to.equal(1);
                        //expect(paginatedTable.pageSize).to.equal(50);
                        done();
                    })
                    .catch(done);
            });
        });

        describe('checkAllOnCurrentPage()', function() {
            it('PaginatedTable check all rows on current page', function(done) {

                // ARRANGE
                var data = [];
                for (var i = 0; i < 100; i++) {
                    data.push({
                        'username': 'username' + i,
                        'status': 'status' + i,
                        'name': 'name' + i,
                        'surname': 'surname' + i,
                        'email': 'email' + i,
                        'lastLogin': 'lastLogin' + i,
                        'failedLogins': i
                    });
                }
                sandbox.stub(net, 'ajax').yieldsTo('success', data);

                paginatedTable = new PaginatedTable({
                    title: 'title1',
                    uniqueID: 'username',
                    pageSize: 50,
                    url: '/oss/idm/usermanagement/users',
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: [{
                        title: 'username',
                        attribute: 'username'
                    }, {
                        title: 'status',
                        attribute: 'status'
                    }, {
                        title: 'name',
                        attribute: 'name'
                    }, {
                        title: 'surname',
                        attribute: 'surname'
                    }, {
                        title: 'email',
                        attribute: 'email'
                    }, {
                        title: 'lastLogin',
                        attribute: 'lastLogin'
                    }, {
                        title: 'failedlogins',
                        attribute: 'failedlogins'
                    }],
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    }
                });

                paginatedTable.getPageData(1, true)
                    .then(function() {
                        // ACT
                        paginatedTable.checkAllOnCurrentPage();

                        // VERIFY
                        expect(paginatedTable.getCheckedRows().length).to.equal(50);
                        //expect(paginatedTable.selectedPage).to.equal(1);
                        //expect(paginatedTable.pageSize).to.equal(50);
                        done();
                    })
                    .catch(done);
            });
        });

        describe('clearAll()', function() {
            it('PaginatedTable clear checks for all rows', function(done) {

                // ARRANGE
                var data = [];
                for (var i = 0; i < 100; i++) {
                    data.push({
                        'username': 'username' + i,
                        'status': 'status' + i,
                        'name': 'name' + i,
                        'surname': 'surname' + i,
                        'email': 'email' + i,
                        'lastLogin': 'lastLogin' + i,
                        'failedLogins': i
                    });
                }
                sandbox.stub(net, 'ajax').yieldsTo('success', data);

                paginatedTable = new PaginatedTable({
                    title: 'title1',
                    uniqueID: 'username',
                    pageSize: 50,
                    url: '/oss/idm/usermanagement/users',
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: [{
                        title: 'username',
                        attribute: 'username'
                    }, {
                        title: 'status',
                        attribute: 'status'
                    }, {
                        title: 'name',
                        attribute: 'name'
                    }, {
                        title: 'surname',
                        attribute: 'surname'
                    }, {
                        title: 'email',
                        attribute: 'email'
                    }, {
                        title: 'lastLogin',
                        attribute: 'lastLogin'
                    }, {
                        title: 'failedlogins',
                        attribute: 'failedlogins'
                    }],
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    }
                });

                paginatedTable.getPageData(1, true)
                    .then(function() {
                        // ACT
                        paginatedTable.checkAll();
                        paginatedTable.clearAll();

                        // VERIFY
                        expect(paginatedTable.getCheckedRows().length).to.equal(0);
                        //expect(paginatedTable.selectedPage).to.equal(1);
                        //expect(paginatedTable.pageSize).to.equal(50);
                        done();
                    })
                    .catch(done);
            });
        });

        describe('setQueryParams()', function() {
            it('PaginatedTable set query params', function(done) {

                // ARRANGE
                var data = [];
                for (var i = 0; i < 100; i++) {
                    data.push({
                        'username': 'username' + i,
                        'status': 'status' + i,
                        'name': 'name' + i,
                        'surname': 'surname' + i,
                        'email': 'email' + i,
                        'lastLogin': 'lastLogin' + i,
                        'failedLogins': i
                    });
                }
                sandbox.stub(net, 'ajax').yieldsTo('success', data);

                paginatedTable = new PaginatedTable({
                    title: 'title1',
                    uniqueID: 'username',
                    pageSize: 50,
                    url: '/oss/idm/usermanagement/users',
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: [{
                        title: 'username',
                        attribute: 'username'
                    }, {
                        title: 'status',
                        attribute: 'status'
                    }, {
                        title: 'name',
                        attribute: 'name'
                    }, {
                        title: 'surname',
                        attribute: 'surname'
                    }, {
                        title: 'email',
                        attribute: 'email'
                    }, {
                        title: 'lastLogin',
                        attribute: 'lastLogin'
                    }, {
                        title: 'failedlogins',
                        attribute: 'failedlogins'
                    }],
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    }
                });

                paginatedTable.getPageData(1, true)
                    .then(function() {
                        // ACT
                        paginatedTable.setQueryParams({
                            query: {
                                pagesize: 10,
                                pagenumber: 2
                            }
                        });

                        // VERIFY
                        expect(paginatedTable.getPageData.callCount).to.equal(1);
                        expect(paginatedTable.getCheckedRows().length).to.equal(0);
                        //expect(paginatedTable.selectedPage).to.equal(2);
                        //expect(paginatedTable.pageSize).to.equal(10);
                        done();
                    })
                    .catch(done);

                sandbox.spy(paginatedTable, 'getPageData');
            });
        });

        describe('getQueryParams()', function() {
            it('PaginatedTable get query params', function(done) {

                // ARRANGE
                sandbox.stub(net, 'ajax').yieldsTo('success', [{
                    'username': 'username1',
                    'status': 'status1',
                    'name': 'name1',
                    'surname': 'surname1',
                    'email': 'email1',
                    'lastLogin': 'lastLogin1',
                    'failedLogins': 1
                }]);

                paginatedTable = new PaginatedTable({
                    title: 'title1',
                    uniqueID: 'username',
                    pageSize: 50,
                    url: '/oss/idm/usermanagement/users',
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: [{
                        title: 'username',
                        attribute: 'username'
                    }, {
                        title: 'status',
                        attribute: 'status'
                    }, {
                        title: 'name',
                        attribute: 'name'
                    }, {
                        title: 'surname',
                        attribute: 'surname'
                    }, {
                        title: 'email',
                        attribute: 'email'
                    }, {
                        title: 'lastLogin',
                        attribute: 'lastLogin'
                    }, {
                        title: 'failedlogins',
                        attribute: 'failedlogins'
                    }],
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    }
                });

                paginatedTable.getPageData(1, true)
                    .then(function() {
                        // VERIFY
                        expect(paginatedTable.getQueryParams().pagenumber).to.equal(1);
                        expect(paginatedTable.getQueryParams().pagesize).to.equal(50);
                        expect(paginatedTable.getCheckedRows().length).to.equal(0);
                        //expect(paginatedTable.selectedPage).to.equal(1);
                        //expect(paginatedTable.pageSize).to.equal(50);
                        done();
                    })
                    .catch(done);
            });

            it('PaginatedTable get query params after set it', function() {

                // ARRANGE
                var data = [];
                for (var i = 0; i < 20; i++) {
                    data.push({
                        'username': 'username' + i,
                        'status': 'status' + i,
                        'name': 'name' + i,
                        'surname': 'surname' + i,
                        'email': 'email' + i,
                        'lastLogin': 'lastLogin' + i,
                        'failedLogins': i
                    });
                }
                sandbox.stub(net, 'ajax').yieldsTo('success', data);

                paginatedTable = new PaginatedTable({
                    title: 'title1',
                    uniqueID: 'username',
                    pageSize: 50,
                    url: '/oss/idm/usermanagement/users',
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: [{
                        title: 'username',
                        attribute: 'username'
                    }, {
                        title: 'status',
                        attribute: 'status'
                    }, {
                        title: 'name',
                        attribute: 'name'
                    }, {
                        title: 'surname',
                        attribute: 'surname'
                    }, {
                        title: 'email',
                        attribute: 'email'
                    }, {
                        title: 'lastLogin',
                        attribute: 'lastLogin'
                    }, {
                        title: 'failedlogins',
                        attribute: 'failedlogins'
                    }],
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    }
                });

                paginatedTable.getPageData(1, true);

                sandbox.spy(paginatedTable, 'getPageData');

                // ACT
                paginatedTable.setQueryParams({
                    pagesize: 10,
                    pagenumber: 2
                });

                // VERIFY
                expect(paginatedTable.getQueryParams().pagenumber).to.equal(2);
                expect(paginatedTable.getQueryParams().pagesize).to.equal(10);
                expect(paginatedTable.getPageData.callCount).to.equal(1);
                expect(paginatedTable.getCheckedRows().length).to.equal(0);
                //expect(paginatedTable.selectedPage).to.equal(2);
                //expect(paginatedTable.pageSize).to.equal(10);
            });
        });

        describe('getRowByUniqueId()', function() {
            it('should properly return row when given uniqueId', function(done) {

                // ARRANGE
                var data = [];
                for (var i = 0; i < 5; i++) {
                    data.push({
                        'username': 'username' + i,
                        'status': 'status' + i,
                        'name': 'name' + i,
                        'surname': 'surname' + i,
                        'email': 'email' + i,
                        'lastLogin': 'lastLogin' + i,
                        'failedLogins': i
                    });
                }
                sandbox.stub(net, 'ajax').yieldsTo('success', data);

                paginatedTable = new PaginatedTable({
                    uniqueID: 'username',
                    title: 'title1',
                    pageSize: 50,
                    url: '/oss/idm/usermanagement/users',
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: [{
                        title: 'username',
                        attribute: 'username'
                    }, {
                        title: 'status',
                        attribute: 'status'
                    }, {
                        title: 'name',
                        attribute: 'name'
                    }, {
                        title: 'surname',
                        attribute: 'surname'
                    }, {
                        title: 'email',
                        attribute: 'email'
                    }, {
                        title: 'lastLogin',
                        attribute: 'lastLogin'
                    }, {
                        title: 'failedLogins',
                        attribute: 'failedLogins'
                    }],
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    }
                });
                paginatedTable.getPageData(1, true)
                    .then(function() {
                        var _rowForUsername1 = paginatedTable.getRowByUniqueId('username1');
                        expect(_rowForUsername1.getIndex()).to.equal(1);
                        expect(_rowForUsername1.getData().username).to.equal('username1');
                        expect(_rowForUsername1.getData().status).to.equal('status1');
                        expect(_rowForUsername1.getData().name).to.equal('name1');
                        expect(_rowForUsername1.getData().surname).to.equal('surname1');
                        expect(_rowForUsername1.getData().email).to.equal('email1');
                        expect(_rowForUsername1.getData().lastLogin).to.equal('lastLogin1');
                        expect(_rowForUsername1.getData().failedLogins).to.equal(1);
                        done();
                    })
                    .catch(done);
            });
        });

        describe('checkRowByUniqueId()', function() {
            it('should properly check row when given uniqueId', function(done) {

                // ARRANGE
                var data = [];
                for (var i = 0; i < 5; i++) {
                    data.push({
                        'username': 'username' + i,
                        'status': 'status' + i,
                        'name': 'name' + i,
                        'surname': 'surname' + i,
                        'email': 'email' + i,
                        'lastLogin': 'lastLogin' + i,
                        'failedLogins': i
                    });
                }
                sandbox.stub(net, 'ajax').yieldsTo('success', data);

                paginatedTable = new PaginatedTable({
                    uniqueID: 'username',
                    title: 'title1',
                    pageSize: 50,
                    url: '/oss/idm/usermanagement/users',
                    modifiers: [{
                        name: 'striped'
                    }],
                    columns: [{
                        title: 'username',
                        attribute: 'username'
                    }, {
                        title: 'status',
                        attribute: 'status'
                    }, {
                        title: 'name',
                        attribute: 'name'
                    }, {
                        title: 'surname',
                        attribute: 'surname'
                    }, {
                        title: 'email',
                        attribute: 'email'
                    }, {
                        title: 'lastLogin',
                        attribute: 'lastLogin'
                    }, {
                        title: 'failedLogins',
                        attribute: 'failedLogins'
                    }],
                    sort: {
                        attribute: 'username',
                        order: 'asc'
                    }
                });
                paginatedTable.getPageData(1, true)
                    .then(function() {
                        paginatedTable.checkRowByUniqueId('username1');
                        paginatedTable.checkRowByUniqueId('username3');

                        var _checkedRows = paginatedTable.getCheckedRows();

                        expect(_checkedRows.length).to.equal(2);

                        var _row = _checkedRows[0];
                        expect(_row.username).to.equal('username1');
                        expect(_row.status).to.equal('status1');
                        expect(_row.name).to.equal('name1');
                        expect(_row.surname).to.equal('surname1');
                        expect(_row.email).to.equal('email1');
                        expect(_row.lastLogin).to.equal('lastLogin1');
                        expect(_row.failedLogins).to.equal(1);

                        var _row = _checkedRows[1];
                        expect(_row.username).to.equal('username3');
                        expect(_row.status).to.equal('status3');
                        expect(_row.name).to.equal('name3');
                        expect(_row.surname).to.equal('surname3');
                        expect(_row.email).to.equal('email3');
                        expect(_row.lastLogin).to.equal('lastLogin3');
                        expect(_row.failedLogins).to.equal(3);
                        done();
                    })
                    .catch(done);
            });
        });


    });
});