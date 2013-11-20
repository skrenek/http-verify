var should     = require('should'),
    assert     = require('assert'),
    httpVerify = require('../main.js');

describe('http-verify test suite', function() {

  it('should succeed on a 200 status code', function(done) {
    httpVerify.verify({
      url: 'https://www.google.com',
      conditions: [
        {
          type: 'statusCode'
        }
      ]
    }, function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('should succeed on a 404 when expected', function(done) {
    httpVerify.verify({
      url: 'https://www.google.com/notfound',
      conditions: {
        type: 'statusCode',
        value: 404
      }
    }, function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('should fail on a 200 for a page not found', function(done) {
    httpVerify.verify({
      url: 'https://www.google.com/notfound',
      conditions: {
        type: 'statusCode'
      }
    }, function(err) {
      should.exist(err);
      should.equal('statusCode received 404', err);
      done();
    });
  });

  it('body contains should succeed', function(done) {
    httpVerify.verify({
      url: 'https://www.google.com',
      conditions: {
        type: 'body',
        operator: 'contains',
        value: 'google'
      }
    }, function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('header exists should succeed', function(done) {
    httpVerify.verify({
      url: 'https://www.google.com',
      conditions: {
        type: 'header',
        operator: 'exists',
        nameValue: 'date'
      }
    }, function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('header contains should succeed', function(done) {
    httpVerify.verify({
      url: 'https://www.google.com',
      conditions: {
        type: 'header',
        operator: 'contains',
        nameValue: 'date',
        value: 'GMT'
      }
    }, function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('header equals should succeed', function(done) {
    httpVerify.verify({
      url: 'https://www.google.com',
      conditions: {
        type: 'header',
        operator: 'equals',
        nameValue: 'expires',
        value: '-1'
      }
    }, function(err) {
      should.not.exist(err);
      done();
    });
  });

});