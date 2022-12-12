import chai from "chai";
import chaiHttp from "chai-http";

import server from '../app.js';

import './user-controller-test.js';

chai.should();

chai.use(chaiHttp);

describe('Trucks', () => {

    describe('POST /api/trucks', () => {
        it('It should add a truck for user', (done) => {
            let user = {
                email: "tom@test.com",
                password: "123456"
            };
            let truck = {
                type: 'SPRINTER'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .post('/api/trucks')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .send(truck)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Truck created successfully');
                            done();
                        });
                });
        });
    });

    describe('POST /api/trucks', () => {
        it('It should not add a truck for user', (done) => {
            let user = {
                email: "tom@test.com",
                password: "123456"
            };
            let truck = {
                type: 'type'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .post('/api/trucks')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .send(truck)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('message').eql('"type" must be one of [SPRINTER, SMALL STRAIGHT, LARGE STRAIGHT]');
                            done();
                        });
                });
        });
    });

    describe('GET /api/trucks', () => {
        it('It should return all driver trucks', (done) => {
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
                        .get('/api/trucks')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('trucks');
                            res.body.trucks.should.be.a('array');
                            res.body.trucks[0].should.have.property('_id');
                            res.body.trucks[0].should.have.property('created_by');
                            res.body.trucks[0].should.have.property('assigned_to');
                            res.body.trucks[0].should.have.property('type');
                            res.body.trucks[0].should.have.property('status');
                            res.body.trucks[0].should.have.property('created_date');
                            done();
                        });
                });
        });
    });

    describe('GET /api/trucks/{id}', () => {
        it('It should return driver truck by id', (done) => {
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
                        .get('/api/trucks')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .end((err, res) => {
                            chai.request(server)
                                .get(`/api/trucks/${res.body.trucks[0]._id}`)
                                .set('Authorization', `Bearer ${jwt_token}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('truck');
                                    res.body.truck.should.be.an('object');
                                    res.body.truck.should.have.property('_id');
                                    res.body.truck.should.have.property('created_by');
                                    res.body.truck.should.have.property('assigned_to');
                                    res.body.truck.should.have.property('type');
                                    res.body.truck.should.have.property('status');
                                    res.body.truck.should.have.property('created_date');
                                    done();
                                });
                        });
                });
        });
    });

    describe('PUT /api/trucks/{id}', () => {
        it('It should update driver truck by id', (done) => {
            let truckId;
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
                        .get('/api/trucks')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .end((err, res) => {
                            truckId = res.body.trucks[0]._id;
                            chai.request(server)
                                .put(`/api/trucks/${truckId}`)
                                .set('Authorization', `Bearer ${jwt_token}`)
                                .send({
                                    type: 'SMALL STRAIGHT'
                                })
                                .end((err, res) => {
                                    chai.request(server)
                                        .get(`/api/trucks/${truckId}`)
                                        .set('Authorization', `Bearer ${jwt_token}`)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.should.have.property('truck');
                                            res.body.truck.should.be.an('object');
                                            res.body.truck.should.have.property('_id');
                                            res.body.truck.should.have.property('created_by');
                                            res.body.truck.should.have.property('assigned_to');
                                            res.body.truck.should.have.property('type').eql('SMALL STRAIGHT');
                                            res.body.truck.should.have.property('status');
                                            res.body.truck.should.have.property('created_date');
                                        done();
                                        });
                                });
                        });
                });
        });
    });

    describe('POST /api/trucks/{id}/assign', () => {
        it('It should assign driver truck by id', (done) => {
            let truckId;
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
                        .get('/api/trucks')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .end((err, res) => {
                            truckId = res.body.trucks[0]._id;
                            chai.request(server)
                                .post(`/api/trucks/${truckId}/assign`)
                                .set('Authorization', `Bearer ${jwt_token}`)
                                .end((err, res) => {
                                    chai.request(server)
                                        .get(`/api/trucks/${truckId}`)
                                        .set('Authorization', `Bearer ${jwt_token}`)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.should.have.property('truck');
                                            res.body.truck.should.be.an('object');
                                            res.body.truck.should.have.property('assigned_to').to.not.eql(null);
                                        done();
                                        });
                                });
                        });
                });
        });
    });

    describe('DELETE /api/trucks/{id}', () => {
        it('It should not delete driver truck by id (it`s assigned to this driver)', (done) => {
            let truckId;
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
                        .get('/api/trucks')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .end((err, res) => {
                            truckId = res.body.trucks[0]._id;
                            chai.request(server)
                                .delete(`/api/trucks/${truckId}`)
                                .set('Authorization', `Bearer ${jwt_token}`)
                                .end((err, res) => {
                                    res.should.have.status(400);
                                    res.body.should.have.property('message').eql(`You cannot delete this truck because it's assigned to you`);
                                done();
                            });
                        });
                });
        });
    });
});

