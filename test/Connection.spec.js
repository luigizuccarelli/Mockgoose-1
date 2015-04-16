/*jshint expr: true*/
/*jshint -W079 */ //redefined expect
'use strict';
var expect = require('chai').expect;

describe('Connection Tests', function () {

    var mockgoose = require('../Mockgoose');
    var Mongoose = require('mongoose').Mongoose;
    var mongoose;

    beforeEach(function (done) {
        mongoose = new Mongoose();
        mockgoose(mongoose);
        done();
    });

    afterEach(function (done) {
        done();
    });

    describe('Events', function () {

        it('Dispatch connecting event on connect', function (done) {
            var connection = mongoose.connect('mongodb://localhost:27017/blah').connection;
            connection.on('connecting', function () {
                expect(connection._mockReadyState).to.equal(2);
                done();
            });
        });

        it('Dispatch connected event on connect', function (done) {
            var connection = mongoose.connect('mongodb://localhost:27017/blah').connection;
            connection.on('connected', function () {
                expect(connection._mockReadyState).to.equal(1);
                done();
            });
        });

        it('Dispatch open event on connect', function (done) {
            var connection = mongoose.connect('mongodb://localhost:27017/blah').connection;
            connection.on('open', function () {
                expect(connection._mockReadyState).to.equal(1);
                done();
            });
        });

        it('Dispatch Error event on connect', function (done) {
            mongoose = new Mongoose();
            mockgoose(mongoose, true);
            var connection = mongoose.connect('mongodb://localhost:27017/blah').connection;
            connection.on('error', function (err) {
                expect(err).not.to.be.an('undefined');
                expect(connection._mockReadyState).to.equal(0);
                done();
            });
        });

        it('Dispatch connecting event on createConnection', function (done) {
            var connection = mongoose.createConnection('mongodb://localhost:27017/blah');
            connection.on('connecting', function () {
                expect(connection._mockReadyState).to.equal(2);
                done();
            });
        });

        it('Dispatch connected event on createConnection', function (done) {
            var connection = mongoose.createConnection('mongodb://localhost:27017/blah');
            connection.on('connected', function () {
                expect(connection._mockReadyState).to.equal(1);
                done();
            });
        });

        it('#68 https://github.com/mccormicka/Mockgoose/issues/68 Dispatch connected event once createConnection', function (done) {
            var connection = mongoose.createConnection('mongodb://localhost:27017/blah');
            connection.once('connected', function () {
                expect(connection._mockReadyState).to.equal(1);
                done();
            });
        });

        it('Dispatch open event on createConnection', function (done) {
            var connection = mongoose.createConnection('mongodb://localhost:27017/blah');
            connection.on('open', function () {
                expect(connection._mockReadyState).to.equal(1);
                done();
            });
        });

        it('Dispatch Error event on createConnection', function (done) {
            mongoose = new Mongoose();
            mockgoose(mongoose, true);
            var connection = mongoose.createConnection('mongodb://localhost:27017/blah');
            connection.on('error', function (err) {
                expect(err).not.to.be.an('undefined');
                expect(connection._mockReadyState).to.equal(0);
                done();
            });
        });
    });

    describe('Connect', function () {
        var connection;
        var SimpleModel;
        beforeEach(function (done) {
            connection = mongoose.connect('mongodb://localhost:27017/TestingDB');
            expect(mongoose.connections.length).to.equal(1);
            SimpleModel = require('./models/SimpleModel')(mongoose);
            SimpleModel.create(
                {name: 'one', value: 'one'},
                function (err) {
                    done(err);
                }
            );
        });

        it('Connection should always be the same instance', function (done) {
            expect(mongoose.connect('mongodb://localhost:27017/TestingDB2')).to.equal(connection);
            done();
        });

        it('Be able to connect with just a host and database and port and options and callback', function (done) {
            mongoose.connect('mongodb://localhost/', 'TestingDB', '8080', {db: 'something'}, function (err, result) {
                expect(err).to.be.a('null');
                expect(result).to.be.ok;
                done();
            });
        });

        it('Should NOT return an error when connecting to Mockgoose through connect', function (done) {
            mongoose.connect('mongodb://localhost:27017/TestingDB', function (err, result) {
                expect(err).to.be.a('null');
                expect(result).to.be.ok;
                done();
            });
        });

        it('Be able to connect with just a host', function (done) {
            expect(function () {
                mongoose.connect('mongodb://localhost:27017/TestingDB');
                done();
            }).not.to.throw();
        });

        it('Be able to connect with just a host and callback', function (done) {
            mongoose.connect('mongodb://localhost:27017/TestingDB', function (err, result) {
                expect(err).to.be.a('null');
                expect(result).to.be.ok;
                done();
            });
        });

        it('Be able to connect with just a host and database', function (done) {
            expect(function () {
                mongoose.connect('mongodb://localhost:27017/', 'TestingDB');
                done();
            }).not.to.throw();
        });

        it('Be able to connect with just a host and database and callback', function (done) {
            mongoose.connect('mongodb://localhost:27017/', 'TestingDB', function (err, result) {
                expect(err).to.be.a('null');
                expect(result).to.be.ok;
                done();
            });
        });

        it('Be able to connect with just a host and database and port', function (done) {
            expect(function () {
                mongoose.connect('mongodb://localhost:27017/', 'TestingDB', 8080);
                done();
            }).not.to.throw();
        });

        it('Be able to connect with just a host and database and port and callback', function (done) {
            mongoose.connect('mongodb://localhost:27017/', 'TestingDB', '8080', function (err, result) {
                expect(err).to.be.a('null');
                expect(result).to.be.ok;
                done();
            });
        });

        it('Be able to connect with just a host and database and port and options', function (done) {
            expect(function () {
                mongoose.connect('mongodb://localhost:27017/', 'TestingDB', 8080, {db: 'something'});
                done();
            }).not.to.throw();
        });

        it('Be able to return the same model instance lowercase', function (done) {
            var model = mongoose.model('simple');
            expect(model).to.equal(SimpleModel);
            done();
        });

    });

    describe('CreateConnection', function () {
        var connection;
        var SimpleModel;
        beforeEach(function (done) {
            connection = mongoose.createConnection('mongodb://localhost:27017/TestingDB');
            expect(mongoose.connections.length).to.equal(2);
            SimpleModel = require('./models/SimpleModel')(connection);
            SimpleModel.create(
                {name: 'one', value: 'one'},
                function (err) {
                    done(err);
                }
            );
        });

        it('Should NOT return an error when connecting to Mockgoose through createConnection', function (done) {
            mongoose.createConnection('mongodb://localhost:27017/TestingDB', function (err, result) {
                expect(err).to.be.a('null');
                expect(result).to.be.ok;
                done();
            });
        });

        it('Return a new instance when creating a connection', function (done) {
            var model = mongoose.model('simple');
            var model2 = connection.model('simple');
            expect(model).to.equal(model2);
            done();
        });

    });

});
