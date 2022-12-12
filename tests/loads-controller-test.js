import chai from "chai";
import chaiHttp from "chai-http";

import server from '../app.js';

import { disconnectDB } from "./database.js";

import './trucks-controller-test.js';

chai.should();

chai.use(chaiHttp);

describe('Loads', () => {
    after(() => {
        disconnectDB();
        server.close();
    });

    describe('POST /api/loads', () => {
        it('It should add a load for a shipper', (done) => {
            let user = {
                email: "anna@test.com",
                password: "123456"
            };
            let payload = {
                name: "Moving sofa",
                payload: 100,
                pickup_address: "Flat 25, 12/F, Acacia Building 150 Kennedy Road",
                delivery_address: "Sr. Rodrigo Domínguez Av. Bellavista N° 185",
                dimensions: {
                    width: 44,
                    length: 32,
                    height: 66
                }
            }
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .post('/api/loads')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .send(payload)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Load created successfully');
                            done();
                        });
                });
        });
    });

    describe('POST /api/loads', () => {
        it('It should not add a load for a shipper (no payload)', (done) => {
            let user = {
                email: "anna@test.com",
                password: "123456"
            };
            let payload = {
                name: "Moving sofa",
                pickup_address: "Flat 25, 12/F, Acacia Building 150 Kennedy Road",
                delivery_address: "Sr. Rodrigo Domínguez Av. Bellavista N° 185",
                dimensions: {
                    width: 44,
                    length: 32,
                    height: 66
                }
            }
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .post('/api/loads')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .send(payload)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('message').eql('"payload" is required');
                            done();
                        });
                });
        });
    });

    describe('GET /api/trucks', () => {
        it('It should return all shipper loads with status "NEW"', (done) => {
            let user = {
                email: "anna@test.com",
                password: "123456"
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .get('/api/loads')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .query({ status: 'NEW' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('loads').with.lengthOf(1);
                            done();
                        });
                });
        });
    });

    describe('GET /api/loads/{id}', () => {
        it('It should return a shipper load by id', (done) => {
            let user = {
                email: "anna@test.com",
                password: "123456"
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .get('/api/loads')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .query({ status: 'NEW' })
                        .end((err, res) => {
                            chai.request(server)
                                .get(`/api/loads/${res.body.loads[0]._id}`)
                                .set('Authorization', `Bearer ${jwt_token}`)
                                .end((err, res) => {
                                    const load = res.body.load;
                                    res.should.have.status(200);
                                    res.body.should.have.property('load');
                                    load.should.be.an('object');
                                    load.should.have.property('_id');
                                    load.should.have.property('created_by');
                                    load.should.have.property('status');
                                    load.should.have.property('assigned_to');
                                    load.should.have.property('state');
                                    load.should.have.property('name');
                                    load.should.have.property('payload');
                                    load.should.have.property('pickup_address');
                                    load.should.have.property('delivery_address');
                                    load.should.have.property('dimensions');
                                    load.dimensions.should.be.an('object');
                                    load.dimensions.should.have.property('width');
                                    load.dimensions.should.have.property('height');
                                    load.dimensions.should.have.property('length');
                                    load.should.have.property('logs');
                                    load.logs.should.be.a('array');
                                    load.should.have.property('created_date');
                                    done();
                                });
                        });
                });
        });
    });

    describe('GET /api/loads/{id}', () => {
        it('It should update a shipper load by id', (done) => {
            let user = {
                email: "anna@test.com",
                password: "123456"
            };
            let payload = {
                name: "Moving sofa_Updated",
                pickup_address: "Flat 25, 12/F, Acacia Building 150 Kennedy Road_Updated",
                delivery_address: "Sr. Rodrigo Domínguez Av. Bellavista N° 185_Updated",
                payload: 200,
                dimensions: {
                    width: 40,
                    length: 30,
                    height: 60
                }
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .get('/api/loads')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .query({ status: 'NEW' })
                        .end((err, res) => {
                            const loadId = res.body.loads[0]._id;
                            chai.request(server)
                                .put(`/api/loads/${loadId}`)
                                .set('Authorization', `Bearer ${jwt_token}`)
                                .send(payload)
                                .end((err, res) => {
                                    chai.request(server)
                                        .get(`/api/loads/${loadId}`)
                                        .set('Authorization', `Bearer ${jwt_token}`)
                                        .end((err, res) => {
                                            const load = res.body.load;
                                            res.should.have.status(200);
                                            load.should.have.property('payload').eql(200)
                                            load.should.have.property('pickup_address').eql('Flat 25, 12/F, Acacia Building 150 Kennedy Road_Updated');
                                            load.should.have.property('delivery_address').eql('Sr. Rodrigo Domínguez Av. Bellavista N° 185_Updated');
                                            load.should.have.property('name').eql('Moving sofa_Updated');
                                            load.dimensions.should.have.property('width').eql(40);
                                            load.dimensions.should.have.property('height').eql(60);
                                            load.dimensions.should.have.property('length').eql(30);
                                            done();
                                        });
                                });
                        });
                });
        });
    });

    describe('POST /api/loads/{id}/post', () => {
        it('It post a load (shipper)', (done) => {
            const shipper = {
                email: "anna@test.com",
                password: "123456"
            };
            const driver = {
                email: "tom@test.com",
                password: "123456"
            }
            chai.request(server)
                .post('/api/auth/login')
                .send(shipper)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .get('/api/loads')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .query({ status: 'NEW' })
                        .end((err, res) => {
                            chai.request(server)
                                .post(`/api/loads/${res.body.loads[0]._id}/post`)
                                .set('Authorization', `Bearer ${jwt_token}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('message').eql('Load posted successfully');
                                    res.body.should.have.property('driver_found').eql(true);
                                    chai.request(server)
                                        .post('/api/auth/login')
                                        .send(driver)
                                        .end((err, res) => {
                                            const { jwt_token } = res.body;
                                            chai.request(server)
                                                .get('/api/trucks')
                                                .set('Authorization', `Bearer ${jwt_token}`)
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    res.body.should.have.property('trucks').with.lengthOf(1);
                                                    res.body.trucks[0].should.have.property('status').eql('OL');
                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });
    });

    describe('GET /api/loads/active', () => {
        it('It should return a driver active load', (done) => {
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
                        .get('/api/loads/active')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .end((err, res) => {
                            const load = res.body.load;
                            res.should.have.status(200);
                            res.body.should.have.property('load');
                            load.should.be.an('object');
                            load.should.have.property('_id');
                            load.should.have.property('created_by');
                            load.should.have.property('status');
                            load.should.have.property('assigned_to');
                            load.should.have.property('state');
                            load.should.have.property('name');
                            load.should.have.property('payload');
                            load.should.have.property('pickup_address');
                            load.should.have.property('delivery_address');
                            load.should.have.property('dimensions');
                            load.dimensions.should.be.an('object');
                            load.dimensions.should.have.property('width');
                            load.dimensions.should.have.property('height');
                            load.dimensions.should.have.property('length');
                            load.should.have.property('logs');
                            load.logs.should.be.a('array');
                            load.logs[0].should.have.property('message');
                            load.logs[0].should.have.property('time');
                            load.should.have.property('created_date');
                            done();
                        });
                });
        });
    });

    describe('PATCH /api/loads/active/state', () => {
        it("It should change the load state to the 'Arrived to Pick up'", (done) => {
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
                        .patch('/api/loads/active/state')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .send({})
                        .end((err, res) => {
                            chai.request(server)
                                .get(`/api/loads/active`)
                                .set('Authorization', `Bearer ${jwt_token}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.have.property('load');
                                    res.body.load.should.be.an('object');
                                    res.body.load.should.have.property('state').eql('Arrived to Pick up');
                                    done();
                                });
                        });
                });
        });
    });

    describe('POST /api/loads', () => {
        it('It should add a load for a shipper', (done) => {
            let user = {
                email: "anna@test.com",
                password: "123456"
            };
            let payload = {
                name: "Washing machine",
                payload: 90,
                pickup_address: "5009 Caryn Ct, Lincolnia, VA 22312",
                delivery_address: "4930 Lincoln Ave, Alexandria, VA 22312",
                dimensions: {
                    width: 100,
                    length: 100,
                    height: 100
                }
            }
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .post('/api/loads')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .send(payload)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Load created successfully');
                            done();
                        });
                });
        });
    });

    describe('DELETE /api/loads/{id}', () => {
        it('It should delete a load by id', (done) => {
            let loadId;
            let user = {
                email: "anna@test.com",
                password: "123456"
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    const { jwt_token } = res.body;
                    chai.request(server)
                        .get('/api/loads')
                        .set('Authorization', `Bearer ${jwt_token}`)
                        .query({ status: 'NEW' })
                        .end((err, res) => {
                            loadId = res.body.loads[0]._id;
                            chai.request(server)
                                .delete(`/api/loads/${loadId}`)
                                .set('Authorization', `Bearer ${jwt_token}`)
                                .end((err, res) => {
                                    chai.request(server)
                                        .get('/api/loads')
                                        .set('Authorization', `Bearer ${jwt_token}`)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.should.have.property('loads');
                                            res.body.loads.should.be.a('array').with.lengthOf(1);
                                            done();
                                        });
                                });
                        });
                });
        });
    });
});








