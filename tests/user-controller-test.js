import chai from "chai";
import chaiHttp from "chai-http";

import './auth-controller-test.js';

import server from '../app.js';

chai.should();

chai.use(chaiHttp);

describe('User profile', () => {

    describe('GET /api/users/me', () => {
        it('It should return a user`s profile info (user exists)', (done) => {
            let user = {
                email: "tom@test.com",
                password: "123456"
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .get('/api/users/me')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('user');
                            res.body.user.should.have.property('_id');
                            res.body.user.should.have.property('role');
                            res.body.user.should.have.property('email');
                            res.body.user.should.have.property('created_date');
                            done();
                        })
                });
        });
    });

    describe('GET /api/users/me', () => {
        it('It should not return a user`s profile info (token is not provided)', (done) => {
            chai.request(server)
                .get('/api/users/me')
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have.property('message').eql('A token is required for authentication');
                    done();
                })
        });
    });

    describe('PATCH /api/users/me/password', () => {
        it('It should not change a user`s password (token is not provided)', (done) => {
            chai.request(server)
                .patch('/api/users/me/password')
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have.property('message').eql('A token is required for authentication');
                    done();
                })
        });
    });

    describe('PATCH /api/users/me/password', () => {
        it('It should not change a user`s password (old password is wrong)', (done) => {
            let user = {
                email: "tom@test.com",
                password: "123456"
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .patch('/api/users/me/password')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .send({
                            oldPassword: "1234567",
                            newPassword: "12345678"
                        })
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('message').eql('Invalid old password');
                            done();
                        })
                });
        });

    });

    describe('PATCH /api/users/me/password', () => {
        it('It should not change a user`s password (new password`s length is shorter than 6)', (done) => {
            let user = {
                email: "tom@test.com",
                password: "123456"
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .patch('/api/users/me/password')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .send({
                            oldPassword: "123456",
                            newPassword: "1234"
                        })
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('message').eql('"newPassword" length must be at least 6 characters long');
                            done();
                        })
                });
        });
    });
});

