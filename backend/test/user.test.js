const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../index');
const User = require("../models/user.model");
chai.use(chaiHttp);
const expect = chai.expect;

describe("User Controller", function () {
    let user;
    let token;

    before(async function () {
        await User.deleteMany({});
        user = new User({
            fullName: "hadiaTesting",
            email: "hadiaTesting@gmail.com",
            password: "hadiaTesting",
        });
        await user.save();

        token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
    });

    describe("POST /user/login", function () {
        it("should log in a user with correct credentials", function (done) {
            chai
                .request(app)
                .post("/user/login")
                .send({ email: "hadiaTesting@gmail.com", password: "hadiaTesting" })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("accessToken");
                    expect(res.body.user).to.include({ email: "hadiaTesting@gmail.com", fullName: "hadiaTesting" });
                    done();
                });
        });

        it("should return 404 for non-existent user", function (done) {
            chai
                .request(app)
                .post("/user/login")
                .send({ email: "no@user.com", password: "nouser" })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property("message", "User not found");
                    done();
                });
        });

        it("should return 401 for incorrect password", function (done) {
            chai
                .request(app)
                .post("/user/login")
                .send({ email: "hadiaTesting@gmail.com", password: "hehe" })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property("message", "Wrong Credentials");
                    done();
                });
        });
    });

    describe("POST /user/create-account", function () {
        it("should create a new user", function (done) {
            chai
                .request(app)
                .post("/user/create-account")
                .send({
                    fullName: "Harry Potter",
                    email: "wizard@magic.com",
                    password: "wizard",
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.user).to.include({ email: "wizard@magic.com", fullName: "Harry Potter" });
                    expect(res.body).to.have.property("accessToken");
                    done();
                });
        });

        it("should return 400 for existing user", function (done) {
            chai
                .request(app)
                .post("/user/create-account")
                .send({
                    fullName: "hadiaTesting",
                    email: "hadiaTesting@gmail.com",
                    password: "hadiaTesting",
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("message", "User already Exists");
                    done();
                });
        });

        it("should return 400 for missing fullName", function (done) {
            chai
                .request(app)
                .post("/user/create-account")
                .send({
                    email: "wizard@magic.com",
                    password: "wizard",
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("message", "Full Name is required");
                    done();
                });
        });

        it("should return 400 for missing email", function (done) {
            chai
                .request(app)
                .post("/user/create-account")
                .send({
                    fullName: "Harry Potter",
                    password: "wizard",
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("message", "Email is required");
                    done();
                });
        });

        it("should return 400 for missing password", function (done) {
            chai
                .request(app)
                .post("/user/create-account")
                .send({
                    fullName: "Harry Potter",
                    email: "wizard@magic.com",
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("message", "Password is required");
                    done();
                });
        });
    });
});