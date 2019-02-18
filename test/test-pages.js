var expect  = require('chai').expect;
var request = require('request');

it('Import CSV', function(done) {
    request('http://localhost:3000/api/v1/import' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('Assign requset', function(done) {
    request('http://localhost:3000/api/v1/assignButler' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});
