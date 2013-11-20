var request = require('request'),
    _       = require('underscore');

module.exports = {

  verify: function(options, cb) {

    var url        = options.url,
        conditions = options.conditions,
        task       = this;

    if (! url) {
      throw new Error ('`url` is required.');
    }
    if (! conditions ) {
      throw new Error ('`conditions` is required.');
    }

    if (! _.isArray(conditions)) {
      conditions = [ conditions ];
    }

    request(url, function(err, res, body) {
      var conditionsMet = true,
          result = "";

      if (err) {
        conditionsMet = false;
        result = 'Error making verification request: ' + JSON.stringify(err);
      } else {

        _.each(conditions, function(condition) {
          switch (condition.type) {
            case 'statusCode':
              var code = condition.value || 200;
              if (res.statusCode !== code) {
                conditionsMet = false;
                result = 'statusCode received ' + res.statusCode;
              }
              break;
            case 'body':
              var passFail = true;
              if (condition.operator && condition.operator === 'contains') {
                passFail = (res.body.indexOf(condition.value) >= 0);
              } else {
                passFail = (res.body === condition.value);
              }
              if (! passFail) {
                conditionsMet = false;
                result = 'body expected ' + (condition.operator || 'equals') + ' ' + condition.value;
              }
              break;
            case 'header':
              var h = res.headers,
                  headerExists = h.hasOwnProperty(condition.nameValue);
              if (! headerExists) {
                conditionsMet = false;
                result = "header " + condition.nameValue + " not found";
              } else {

                if (condition.operator === 'contains') {
                  if (h[condition.nameValue] && h[condition.nameValue].indexOf(condition.value) < 0) {
                    conditionsMet = false;
                    result = "header " + condition.nameValue + " does not contain " + condition.value;
                  } 
                } else if (condition.operator === 'equals') {
                  if (h[condition.nameValue] !== condition.value) {
                  conditionsMet = false;
                  result = "header " + condition.nameValue + " value " + h[condition.nameValue] + " is incorrect";
                }
                }
              }

              break;
          }
        });
      }

      cb && cb(conditionsMet ? null : result);
    }); // end request
  }
};