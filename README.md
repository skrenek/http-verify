# http-verify

Verify one or more parts of an http response.

## Options
* url - required if httpOptions not specified.  the url to verify
* strictSSL - whether or not to verify SSL certs on https calls
* httpOptions - use if you want to pass options to the request module
* conditions - an object, or array of objects, containing the url and conditions to be met  
  * type - one of `statusCode`, `body`, or `header`.
  * operator - the operator to use.  defaults to '`equals`'
    * ignored for statusCode types
    * body type - may be `contains` or `equals`
    * header type - may be `contains`, `equals	`, or `exists`
  * value - the value to look for.  ignored for `header exists` conditions
  * nameValue - used only for header types; the name of the header to look for

## Examples
Example status code test from the module's unit tests  

```
it('should succeed on a 200 status code', function(done) {
    httpVerify.verify({
      url: 'https://www.google.com',
      conditions: [
        {
          type: 'statusCode',
          value: 200
        }
      ]
    }, function(err) {
      should.not.exist(err);
      done();
    });
  });
```

Body type example.  Note that here the `conditions` property is an object, not an array.

```
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
```

Header type examples from the unit tests.  Note that Node usually converts header names to lower-case.

```
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
```