import chai from "chai";
import chaiHttp from "chai-http";

import server from '../app.js';

import { connectDB } from "./database.js";

chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
    before(() => {
        connectDB();
    });

    describe('POST /api/auth/register', () => {
        it('It should register a new user (driver)', (done) => {
            let user = {
                email: "tom@test.com",
                password: "123456",
                role: "DRIVER"
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Profile created successfully');
                done();
            });
        });
    });

    describe('POST /api/auth/register', () => {
        it('It should register a new user (shipper)', (done) => {
            let user = {
                email: "anna@test.com",
                password: "123456",
                role: "SHIPPER"
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Profile created successfully');
                done();
            });
        });
    });

    describe('POST /api/auth/register', () => {
        it('It should not register a new user (already exists)', (done) => {
            let user = {
                email: "tom@test.com",
                password: "123456",
                role: "DRIVER"
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User exists already, please login instead');
                done();
            });
        });
    });

    describe('POST /api/auth/register', () => {
        it('It should not register a new user (role is not provided)', (done) => {
            let user = {
                email: "tom@test.com",
                password: "123456"
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('"role" is required');
                done();
            });
        });
    });

    describe('POST /api/auth/register', () => {
        it('It should not register a new user (role is not DRIVER or SHIPPER)', (done) => {
            let user = {
                email: "bob@test.com",
                password: "123456",
                role: "role"
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('"role" must be one of [SHIPPER, DRIVER]');
                done();
            });
        });
    });

    describe('POST /api/auth/login', () => {
        it('It should login an existing user', (done) => {
            let user = {
                email: "tom@test.com",
                password: "123456"
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('jwt_token');
                done();
            });
        });
    });

    describe('POST /api/auth/login', () => {
        it('It should not login a user with invalid credentials', (done) => {
            let user = {
                email: "bob@test.com",
                password: "123456"
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Invalid creds');
                done();
            });
        });
    });
});
