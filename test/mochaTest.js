process.env.NODE_ENV = 'test';
// const assert = require('chai').assert;
const server = 'http://localhost:8080/';

var expect = require('chai').expect;
var request = require('request');

let chai = require('chai');
chai.use(require('chai-http'));
let should = chai.should();
let mlog = require('mocha-logger');

let localEndpoint = 'http://localhost:8080/';
let serverEndpoint = 'http://52.14.42.174:8080/';
let vid = 40851

/*
  * Test the /GET route
  */
/*
describe('/GET notif', () => {
    it('it should GET all the books', (done) => {
        chai.request(server)
            .get('api/notif?birth=16.06.2019')
            .end((err, res) => {
                // res.should.have.status(200);
                expect(res.body).to.equal('Hello World');
                // res.body.should.be.a('array');
                // res.body.length.should.be.eql(0);
                done();
            });
    });
});
*/

it('Error in the age', function (done) {
    this.timeout(1000);
    request(localEndpoint + 'api/notif?babybirth=01.02.201', async function (error, response, body) {
        expect(response.statusCode).to.equal(401);
    });
    request(localEndpoint + 'api/notif?babybirth=01.02.201a', async function (error, response, body) {
        expect(response.statusCode).to.equal(401);
    });
    request(localEndpoint + 'api/notif?babybirth=32.02.2010', async function (error, response, body) {
        expect(response.statusCode).to.equal(401);
    });
    request(localEndpoint + 'api/notif?babybirth=01.0272010', async function (error, response, body) {
        expect(response.statusCode).to.equal(401);
    });
    request(localEndpoint + 'api/notif?babybirth=01.02.1201', async function (error, response, body) {
        expect(response.statusCode).to.equal(401);
    });
    done();
});

it('Valid Notification by age', async function (done) {
    this.timeout(1000);
    var localLog = [0, 0, 0];
    var serverLog = [0, 0, 0];

    // Test le serveur en local
    request(localEndpoint + 'api/notif?babybirth=01.01.2019', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        localLog[0] = body
    });
    request(localEndpoint + 'api/notif?babybirth=05.02.2019', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        localLog[1] = body
    });
    request(localEndpoint + 'api/notif?babybirth=31.03.2019', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        localLog[2] = body
    });

    // Test le serveur officiel
    request(serverEndpoint + 'api/notif?babybirth=01.01.2019', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        serverLog[0] = body
    });
    request(serverEndpoint + 'api/notif?babybirth=05.02.2019', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        serverLog[1] = body
    });
    request(serverEndpoint + 'api/notif?babybirth=31.03.2019', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        serverLog[2] = body
    });

    // Compare les deux réponses
    setTimeout(function () {
        // console.log(serverLog, localLog);
        expect(serverLog[0]).to.equal(localLog[0]);
        expect(serverLog[1]).to.equal(localLog[1]);
        expect(serverLog[2]).to.equal(localLog[2]);
    }, 3000);

    request(localEndpoint + 'api/notif?babybirth=01.05.2019', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });

    done();
});

it('Account creation', async function (done) {
    request(localEndpoint + 'api/user?babybirth=01.01.2019&lastname=Unit&firstname=test', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    done();
});

it('Account update', async function (done) {
    request(localEndpoint + 'api/user?vid=' + vid + '&babybirth=01.01.2019', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);

    });
    request(localEndpoint + 'api/user?vid=' + vid + '&babybirth=01.01.2019&lastname=unit', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);

    });
    request(localEndpoint + 'api/user?vid=0000&babybirth=01.01.2019', async function (error, response, body) {
        expect(response.statusCode).to.equal(401);

    });
    done()
});

it('New Favoris', async function (done) {
    this.timeout(1000);
    request(localEndpoint + 'api/favoris/new?vid=' + vid + '&push=R1', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        // console.log(1, JSON.parse(body).success)
        // expect(JSON.parse(body).success).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/new?vid=' + vid + '&push=R2', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        // console.log(2, JSON.parse(body).success)
        // expect(JSON.parse(body).success).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/new?vid=' + vid + '&push=1', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        // console.log(3, JSON.parse(body).success)
        // expect(JSON.parse(body).success).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/new?vid=' + vid + '&push=2', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        // console.log(4, JSON.parse(body).success)
        // expect(JSON.parse(body).success).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/new?vid=' + vid + '&push=3', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        // console.log(5, JSON.parse(body).success)
        // expect(JSON.parse(body).success).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/new?vid=' + vid + '&push=4', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        console.log(6, JSON.parse(body).success)
        // expect(JSON.parse(body).success).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/new?vid=' + vid + '&push=5', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        console.log(7, JSON.parse(body))
        // expect(JSON.parse(body).success).to.equal(200);
    });
    done()
});

it('10 favoris + duplicate favori', async function (done) {
    request(localEndpoint + 'api/favoris/new?vid=' + vid + '&push=8', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        console.log(10, JSON.parse(body).success)
        expect(JSON.parse(body).success).to.equal(406);
    });
    request(localEndpoint + 'api/favoris/new?vid=' + vid + '&push=R3', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        console.log(11, JSON.parse(body).success)
        expect(JSON.parse(body).success).to.equal(406);
    });
    done()
});

it('delete Favoris', async function (done) {
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=R1', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=R2', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=1', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=2', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=3', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=4', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=5', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=6', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=7', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        console.log("del", JSON.parse(body).success)
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=8', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    request(localEndpoint + 'api/favoris/delete?vid=' + vid + '&push=R3', async function (error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
    done()
});
