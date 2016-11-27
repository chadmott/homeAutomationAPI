import {BootTest} from './BootTest';

let bootTest = new BootTest();
let app = bootTest.app;
let chai = require('chai');
let expect = chai.expect;
let request = require('supertest');

let server;
let agent;
let authToken;

    beforeEach(function() {
        server = app.startServer();
  });
  afterEach(function(done){
      app.server.close(done);
  });
describe('API Should respond to root request', function () {



    //     //   it('errors if wrong basic auth', function(done) {
    //     //     api.get('/blog')
    //     //     .set('x-api-key', '123myapikey')
    //     //     .auth('incorrect', 'credentials')
    //     //     .expect(401, done)
    //     //   });

    //     //   it('errors if bad x-api-key header', function(done) {
    //     //     api.get('/blog')
    //     //     .auth('correct', 'credentials')
    //     //     .expect(401)
    //     //     .expect({error:"Bad or missing app identification header"}, done);
    //     //   });

});

describe('health route should be accessible', function(){
    it('health route should show up', function(done){
         request(server)
            .get('/health')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect('service running')
            .expect(200, done);
    });
});
describe('routes should be inaccessable without authentication', function(){
    it('should deny user access to control device', function(done){
         request(server)
            .get('/api/authenticated')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({ 'success': false, 'message': 'No token provided.' })
            .expect(403, done); ;
    });
});

xdescribe('API Auth should fail on wrong credentials', function () {
    it('should deny user with wrong username, wrong password', function (done) {
        request(server)
            .post('/api/authenticate')
            .send('name=wrong')
            .send('pass=wrong')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({ 'success': false, 'message': 'Authentication failed. No User' }, done);
    });
    it('should deny user with wrong username, right password', function (done) {
        request(server)
            .post('/api/authenticate')
             .send('name=wrong')
            .send('pass=hardpass')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({ 'success': false, 'message': 'Authentication failed. No User' }, done);
    });
    it('should deny user with wrong password, right user', function (done) {
        request(server)
            .post('/api/authenticate')
            .send('name=harduser')
            .send('pass=wrong')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({ 'success': false, 'message': 'Authentication failed. Wrong password.' }, done);
    });
});

xdescribe('Should be able to login with correct credentials', function(){
       it('should deny user with wrong username, wrong password', function (done) {
        request(server)
            .post('/api/authenticate')
            .send('name=harduser')
            .send('pass=hardpass')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({ 'success': true, 'message': 'Enjoy your token!' }, function(err, res){
                authToken = res.body.token;
                done();
            });
    });
       it('should allow user access to restricted routes', function(done){
         request(server)
            .get('/api/authenticated')
            .send('token=' + authToken)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({ 'success': true, 'message': 'Authenticated' })
            .expect(200, done);
    });
});

describe('Should be able to control devices', function(){

       it('enable to turn device on', function (done) {
           request(server)
            .post('/api/devices/5/on')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({
                'status': 'ok',
                'command': 'on',
                'nodeid': 5,
                'level': null})
            .expect(200, done);
       });
        it('enable to turn device off', function (done) {
           request(server)
            .post('/api/devices/5/off')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({
                'status': 'ok',
                'command': 'off',
                'nodeid': 5,
                'level': null})
            .expect(200, done);
       });
       it('enable to fade device to new level', function (done) {
           request(server)
            .post('/api/devices/5/fade')
            .send('level=50')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({
                'status': 'ok',
                'command': 'fade',
                'nodeid': 5,
                'level': 50})
            .expect(200, done);
       });
       it('bad commands should fail', function (done) {
           request(server)
            .post('/api/devices/5/flop')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({
                'status': 'fail',
                'command': 'noop',
                'nodeid': 5,
                'level': null})
            .expect(200, done);
       });
});
describe('Should be able to update device info', function(){
       it('with a name', function (done) {
            request(server)
            .post('/api/devices/5')
            .send('name=updateName')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({
                'name': 'updateName',
                'location': null,
                'nodeid': 5})
            .expect(200, done);
       });
       it('with a location', function (done) {
           request(server)
            .post('/api/devices/5')
            .send('location=updateLocation')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({
                'name': null,
                'location': 'updateLocation',
                'nodeid': 5})
            .expect(200, done);
       });
});
describe('Should be able to get device info', function(){
       it('git single device info', function (done) {
            request(server)
            .get('/api/devices/5')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({
                'name': 'testName',
                'location': 'testLocation'})
            .expect(200, done);
       });
});

describe('Should be able to list devices', function(){
       it('and the device info', function (done) {
            request(server)
            .get('/api/devices')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({
                'status': 'ok',
                'devices': [{
                    'location': 'testLocation',
                    'name': 'testName'
                }]
            })
            .expect(200, done);
       });
});


