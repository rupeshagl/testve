var expect  = require('chai').expect;
var request = require('request');

it('Import CSV', function(done) {
    request('http://localhost:3000/api/v1/import' , function(error, response, body) {
        expect(body).to.equal('{"success":true,"result":"result"}');
        done();
    });
});

it('Assign requset', function(done) {
    request('http://localhost:3000/api/v1/assignButler' , function(error, response, body) {
        expect(body).to.equal('{"success":true,"result":{"butlers":[{"requests":["abc","ghi"]},{"requests":["abc","zzz"]},{"requests":["ghi","def"]},{"requests":["ghi","zzz"]},{"requests":["def","zzz"]}],"spreadClientIds":[1,2]}}');
        done();
    });
});