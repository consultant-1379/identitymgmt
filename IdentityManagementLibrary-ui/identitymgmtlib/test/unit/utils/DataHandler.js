/*global define, describe, it, expect */
define([
    'jscore/core',
    'jscore/ext/net',
    'jscore/ext/utils/base/underscore',
    'identitymgmtlib/utils/DataHandler',
], function(core, net, _, DataHandler) {
    'use strict';

    describe('DataHandler', function() {

        var sandbox, server, dataHandler, resolveCallback, rejectCallback;

        beforeEach(function() {
            //Setup to prepare fake stuffs
            sandbox = sinon.sandbox.create();
            server = sinon.fakeServer.create();
            server.autoRespond = true;
        });

        afterEach(function() {
            sandbox.restore();
            server.restore();
        });

        describe('DataHandler', function() {

            beforeEach(function() {
                var data = [{
                    username: 'userB',
                    surname: 'surnameB',
                    email: 'emailB@enm.com'
                }, {
                    username: 'userC',
                    surname: 'surnameC',
                    email: 'emailC@enm.com'
                }, {
                    username: 'userA',
                    surname: 'surnameA',
                    email: 'emailA@enm.com'
                }];

                server.respondWith("/users", [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify(data)]);

                dataHandler = new DataHandler({
                    url: "/users"
                });

            });

            describe('Regular flow', function() {
                it('Should properly fetch data and return them in same as fetched order', function(done) {
                    // ACT
                    dataHandler.getData()
                        .then(function(data) {
                            // VERIFY
                            expect(data).not.to.be.undefined;
                            expect(data.length).to.equal(3);
                            expect(data[0].username).to.equal("userB");
                            expect(data[1].username).to.equal("userC");
                            expect(data[2].username).to.equal("userA");
                            done();
                        }).catch(done);
                });

                it('Should properly fetch data twice and return them in same as fetched order', function(done) {
                    // ACT
                    Promise.all([
                            new Promise(function(resolve, reject) {
                                setTimeout(function() {
                                    dataHandler.getData().then(resolve, reject);
                                }, 1)
                            }),
                            new Promise(function(resolve, reject) {
                                setTimeout(function() {
                                    dataHandler.getData().then(resolve, reject);
                                }, 100)
                            })
                        ])
                        .then(function(data) {

                            var data1 = data[0];
                            var data2 = data[1];

                            // VERIFY
                            expect(data1).not.to.be.undefined;
                            expect(data1.length).to.equal(3);
                            expect(data1[0].username).to.equal("userB");
                            expect(data1[1].username).to.equal("userC");
                            expect(data1[2].username).to.equal("userA");

                            expect(data2).not.to.be.undefined;
                            expect(data2.length).to.equal(3);
                            expect(data2[0].username).to.equal("userB");
                            expect(data2[1].username).to.equal("userC");
                            expect(data2[2].username).to.equal("userA");

                            done();
                        }).catch(done);
                });
            });

            describe('Sort functionality', function() {
                it('Should properly fetch data and return them in ascending order by username', function(done) {
                    // ACT
                    dataHandler.getData({
                        sort: {
                            order: 'asc',
                            attribute: 'username'
                        }
                    }).then(function(data) {
                        // VERIFY
                        expect(data).not.to.be.undefined;
                        expect(data.length).to.equal(3);
                        expect(data[0].username).to.equal("userA");
                        expect(data[1].username).to.equal("userB");
                        expect(data[2].username).to.equal("userC");
                        done();
                    }).catch(done);
                });

                it('Should properly fetch data and retun them in descending order by username', function(done) {
                    // ACT
                    dataHandler.getData({
                        sort: {
                            order: 'desc',
                            attribute: 'username'
                        }
                    }).then(function(data) {
                        // VERIFY
                        expect(data).not.to.be.undefined;
                        expect(data.length).to.equal(3);
                        expect(data[0].username).to.equal("userC");
                        expect(data[1].username).to.equal("userB");
                        expect(data[2].username).to.equal("userA");
                        done();
                    }).catch(done);
                });
            });

            describe('Filter functionality', function() {
                it('Should properly fetch data, return them in same as fetched order and filter users with surname userA and surename surname', function(done) {
                    // ACT
                    dataHandler.getData({
                        filter: {
                            username: "userA",
                            surname: "surname"
                        }
                    }).then(function(data) {
                        // VERIFY
                        expect(data).not.to.be.undefined;
                        expect(data.length).to.equal(1);
                        expect(data[0].username).to.equal("userA");
                        done();
                    }).catch(done);
                });

                it('Should properly fetch data, return them in same as fetched order and filter users with username userA or userC and surename surname', function(done) {
                    // ACT
                    dataHandler.getData({
                        filter: {
                            username: ["userA", "userC"],
                            surname: "surname"
                        }
                    }).then(function(data) {
                        // VERIFY
                        expect(data).not.to.be.undefined;
                        expect(data.length).to.equal(2);
                        expect(data[0].username).to.equal("userC");
                        expect(data[1].username).to.equal("userA");
                        done();
                    }).catch(done);
                });
            });

            describe('Filter and sort functionality', function() {
                it('Should properly fetch data, return them in ascending order by username and filter users with username userA or userC and surename surname', function(done) {
                    // ACT
                    dataHandler.getData({
                        sort: {
                            order: 'asc',
                            attribute: 'username'
                        },
                        filter: {
                            username: ["userA", "userC"],
                            surname: "surname"
                        }
                    }).then(function(data) {
                        // VERIFY
                        expect(data).not.to.be.undefined;
                        expect(data.length).to.equal(2);
                        expect(data[0].username).to.equal("userA");
                        expect(data[1].username).to.equal("userC");
                        done();
                    }).catch(done);
                });
            });

        });

        describe('Extended DataHandler', function() {

            describe('Overrides fetchData', function() {

                beforeEach(function() {

                    server.respondWith("/users", [200, {
                        "Content-Type": "application/json"
                    }, JSON.stringify([{
                        username: 'userB',
                        surname: 'surnameB',
                        email: 'emailB@enm.com'
                    }, {
                        username: 'userC',
                        surname: 'surnameC',
                        email: 'emailC@enm.com'
                    }, {
                        username: 'userA',
                        surname: 'surnameA',
                        email: 'emailA@enm.com'
                    }])]);

                    server.respondWith("/privileges", [200, {
                        "Content-Type": "application/json"
                    }, JSON.stringify({
                        'userA': {
                            role: 'role1',
                            tg: 'tg1'
                        },
                        'userB': {
                            role: 'role2',
                            tg: 'tg2'
                        },
                        'userC': {
                            role: 'role3',
                            tg: 'tg3'
                        }
                    })]);

                    var DataHandlerExtended = DataHandler.extend({
                        fetchData: function(query) {
                            return new Promise(function(resolve, reject) {
                                if (!(this.data) || query.force) {

                                    Promise.all([
                                        new Promise(function(resolve, reject) {
                                            net.ajax({
                                                url: "/users",
                                                type: 'GET',
                                                dataType: 'json',
                                                success: resolve,
                                                error: reject
                                            });
                                        }),
                                        new Promise(function(resolve, reject) {
                                            net.ajax({
                                                url: "/privileges",
                                                type: 'GET',
                                                dataType: 'json',
                                                success: resolve,
                                                error: reject
                                            });
                                        })
                                    ]).then(function(data_arr) {
                                        var data = data_arr[0];
                                        var privileges = data_arr[1];
                                        data.forEach(function(user) {
                                            user.role = (privileges[user.username] && privileges[user.username].role);
                                            user.tg = (privileges[user.username] && privileges[user.username].tg);
                                        });

                                        query.data = data;
                                        resolve(query);
                                    }.bind(this)).catch(reject);

                                } else {
                                    query.data = this.data;
                                    resolve(query);
                                }
                            }.bind(this));
                        }
                    });

                    dataHandler = new DataHandlerExtended();
                });

                it('Should properly fetch data with overriden function, return them in ascending order by username and filter users with username userA or userC and surename surname', function(done) {
                    // ACT
                    dataHandler.getData({
                        sort: {
                            order: 'asc',
                            attribute: 'username'
                        },
                        filter: {
                            username: ["userA", "userC"],
                            surname: "surname"
                        }
                    }).then(function(data) {
                        // VERIFY
                        expect(data).not.to.be.undefined;
                        expect(data.length).to.equal(2);
                        expect(data[0].username).to.equal("userA");
                        expect(data[1].username).to.equal("userC");
                        done();
                    }).catch(done);
                });
            });

            describe('Overrides fetchData and filterData', function() {

                beforeEach(function() {

                    server.respondWith("/users", [200, {
                        "Content-Type": "application/json"
                    }, JSON.stringify([{
                        username: 'userB',
                        surname: 'surnameB',
                        email: 'emailB@enm.com'
                    }, {
                        username: 'userC',
                        surname: 'surnameC',
                        email: 'emailC@enm.com'
                    }, {
                        username: 'userA',
                        surname: 'surnameA',
                        email: 'emailA@enm.com'
                    }])]);

                    server.respondWith("/privileges", [200, {
                        "Content-Type": "application/json"
                    }, JSON.stringify({
                        'userA': {
                            role: 'role1',
                            tg: 'tg1'
                        },
                        'userB': {
                            role: 'role2',
                            tg: 'tg2'
                        },
                        'userC': {
                            role: 'role3',
                            tg: 'tg3'
                        }
                    })]);

                    server.respondWith("/activesessions", [200, {
                        "Content-Type": "application/json"
                    }, JSON.stringify({
                        'userA': {
                            active: 2
                        },
                        'userB': {
                            active: 1
                        }
                    })]);

                    var DataHandlerExtended = DataHandler.extend({
                        init: function() {
                            this.fetched = {};
                        },

                        fetchData: function(query) {
                            return new Promise(function(resolve, reject) {
                                if (!(this.data) || query.force) {

                                    Promise.all([
                                        new Promise(function(resolve, reject) {
                                            net.ajax({
                                                url: "/users",
                                                type: 'GET',
                                                dataType: 'json',
                                                success: resolve,
                                                error: reject
                                            });
                                        }),
                                        new Promise(function(resolve, reject) {
                                            net.ajax({
                                                url: "/privileges",
                                                type: 'GET',
                                                dataType: 'json',
                                                success: resolve,
                                                error: reject
                                            });
                                        })
                                    ]).then(function(data_arr) {
                                        var data = data_arr[0];
                                        var privileges = data_arr[1];
                                        data.forEach(function(user) {
                                            user.role = (privileges[user.username] && privileges[user.username].role);
                                            user.tg = (privileges[user.username] && privileges[user.username].tg);
                                        });

                                        query.data = data;
                                        resolve(query);
                                    }.bind(this)).catch(reject);

                                } else {
                                    query.data = this.data;
                                    resolve(query);
                                }
                            }.bind(this));
                        },

                        filterData: function(query) {

                            var needsToBeFetch = [{
                                attribute: "active",
                                url: "/activesessions",
                                convert: function(data) {
                                    var retData = {};
                                    for (var a in data) {
                                        retData[a] = retData[a] || {};
                                        retData[a].active = true;
                                    }
                                    return retData;
                                }
                            }, {
                                attribute: "certificates",
                                url: "/certificates",
                                convert: function(data) {
                                    // TODO: 
                                    return data;
                                }
                            }];

                            return new Promise(function(resolve, reject) {

                                // force to fetch data from server next time
                                if (query.force) {
                                    this.fetched = {};
                                }

                                // check if we have some data which needs to be fetched from backend
                                var toFetchArr = needsToBeFetch
                                    .filter(function(toFetch) {
                                        // should be fetched if attibute is in query and was not fetched yet
                                        return toFetch.attribute in query.filter && !(toFetch.attribute in this.fetched);
                                    }.bind(this))
                                    .map(function(toFetch) {
                                        return new Promise(function(resolve, reject) {
                                            net.ajax({
                                                url: toFetch.url,
                                                type: 'GET',
                                                dataType: 'json',
                                                success: function(data) {
                                                    this.fetched[toFetch.attribute] = true;
                                                    resolve(toFetch.convert(data));
                                                }.bind(this),
                                                error: reject
                                            });
                                        }.bind(this));
                                    }.bind(this));

                                Promise.all(toFetchArr).then(function(responses) {
                                        // extend all objects
                                        query.data.forEach(function(user) {
                                            responses.forEach(function(response) {
                                                _.extend(user, response[user.username]);
                                            });
                                        });

                                        // invoke original filter method
                                        resolve(DataHandler.prototype.filterData.call(this, query));

                                    }.bind(this))
                                    .catch(reject);

                            }.bind(this))
                        }
                    });

                    dataHandler = new DataHandlerExtended();
                });

                it('Should properly fetch data with overriden functions, return them in ascending order by username and filter users with username userA or userC, surname surname, active undefined', function(done) {
                    // ACT
                    dataHandler.getData({
                        //force: true,
                        sort: {
                            order: 'asc',
                            attribute: 'username'
                        },
                        filter: {
                            username: ["userA", "userC"],
                            surname: "surname",
                            active: undefined
                        }
                    }).then(function(data) {
                        // VERIFY
                        expect(data).not.to.be.undefined;
                        expect(data.length).to.equal(0);
                        done();
                    }).catch(done);
                });

            });
        });

    });
});