const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../index');
const User = require("../models/user.model");
chai.use(chaiHttp);
const Note = require("../models/note.model");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Note Controller", function () {
    let user;
    let token;
    let note;

    before(async function () {
        await Note.deleteMany({});
        await User.deleteMany({});
        
        // Create a test user
        user = new User({
            fullName: "Test User",
            email: "testuser@example.com",
            password: "testpassword",
        });
        await user.save();

        token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10h" });
        
        // Create a test note
        note = new Note({
            title: "Test Note",
            content: "Test Content",
            userId: user._id
        });
        await note.save();
    });

    describe("POST /notes/add-note", function () {
        it("should add a new note", function (done) {
            chai
                .request(app)
                .post("/notes/add-note")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "New Note", content: "New Content" })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.note).to.include({ title: "New Note", content: "New Content" });
                    done();
                });
        });

        it("should return 400 for missing title or content", function (done) {
            chai
                .request(app)
                .post("/notes/add-note")
                .set("Authorization", `Bearer ${token}`)
                .send({ content: "No Title" })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("message", "Title and Content are required");
                    done();
                });
        });
    });

    describe("PUT /notes/edit-note/:id", function () {
        it("should edit an existing note", function (done) {
            chai
                .request(app)
                .put(`/notes/edit-note/${note._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Updated Note", content: "Updated Content" })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.note).to.include({ title: "Updated Note", content: "Updated Content" });
                    done();
                });
        });

        it("should return 404 for non-existent note", function (done) {
            chai
                .request(app)
                .put("/notes/edit-note/5f50c31b5f50c31b5f50c31b")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Updated Note", content: "Updated Content" })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property("message", "Note not found");
                    done();
                });
        });
    });

    describe("DELETE /notes/delete-note/:id", function () {
        it("should delete an existing note", function (done) {
            chai
                .request(app)
                .delete(`/notes/delete-note/${note._id}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("message", "Note deleted successfully");
                    done();
                });
        });

        it("should return 404 for non-existent note", function (done) {
            chai
                .request(app)
                .delete("/notes/delete-note/5f50c31b5f50c31b5f50c31b")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property("message", "Note not found");
                    done();
                });
        });
    });

    describe("GET /note", function () {
        it("should get all notes for the user", function (done) {
            chai
                .request(app)
                .get("/notes/get-all-notes")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.notes).to.be.an("array");
                    done();
                });
        });
    });

    describe("PUT /update-note-pinned/:id", function () {

        it("should return 404 for non-existent note", function (done) {
            chai
                .request(app)
                .put("/notes/update-note-pinned/5f50c31b5f50c31b5f50c31b")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property("message", "Note not found!");
                    done();
                });
        });
    });

    describe("GET /note/search", function () {
        it("should search for notes by query", function (done) {
            chai
                .request(app)
                .get("/notes/search-notes")
                .set("Authorization", `Bearer ${token}`)
                .query({ query: "Test" })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.notes).to.be.an("array");
                    done();
                });
        });

        it("should return 400 for missing query", function (done) {
            chai
                .request(app)
                .get("/notes/search-notes")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("message", "Search query is required");
                    done();
                });
        });
    });
});
