
import request from "supertest";
import { app } from "../app";
import { should } from "chai";
import { dropUserDB } from "../db/dbUsers";
import { User } from "../models/mongooseSchema";
import "dotenv/config";

const pathUser = "/v1/users/";
const pathUserFavorites = "/v1/users/favorites/";

should();

describe("endpoints users", () => {
    const user = {
        username: "Samuel21",
        email: "samperisi.samuel@gmail.com",
        password: "Password1234"
    };
    describe("test signup", () => {
        after(async () => {
            await dropUserDB();
        });
        it("test 201 for right signup", async () => {
            const { body, status } = await request(app).post(`${pathUser}signup`).send({...user});

            status.should.be.equal(201);
            body.should.have.property("id");
            body.should.have.property("username").equal(user.username);
            body.should.have.property("email").equal(user.email);
            body.should.not.have.property("password");
            body.should.have.property("favorites").have.length(0);
        });
        it("test 409 for email already present", async () => {
            const { status } = await request(app).post(`${pathUser}signup`).send({...user});
            status.should.be.equal(409);
        });
        it("test 400 for short password", async () => {
            const { status } = await request(app).post(`${pathUser}signup`).send({...user, password:"123", email: "emailacaso@gmail.com"});
            status.should.be.equal(400);
        });
        it("test 400 for missing uppercase in password", async () => {
            const { status } = await request(app).post(`${pathUser}signup`).send({...user, password:"password123", email: "emailacaso@gmail.com"});
            status.should.be.equal(400);
        });
        it("test 400 for missing lowercase in password", async () => {
            const { status } = await request(app).post(`${pathUser}signup`).send({...user, password:"PASSWORD123", email: "emailacaso@gmail.com"});
            status.should.be.equal(400);
        });
        it("test 400 for missing numbers in password", async () => {
            const { status } = await request(app).post(`${pathUser}signup`).send({...user, password:"Password", email: "emailacaso@gmail.com"});
            status.should.be.equal(400);
        });
        it("test 400 for missing letters in password", async () => {
            const { status } = await request(app).post(`${pathUser}signup`).send({...user, password:"12345678910", email: "emailacaso@gmail.com"});
            status.should.be.equal(400);
        });
        it("test 400 for invalid email", async () => {
            const { status } = await request(app).post(`${pathUser}signup`).send({...user, email:"wrong email"});
            status.should.be.equal(400);
        });
        it("test 400 for missing value", async () => {
            const { status } = await request(app).post(`${pathUser}signup`).send({password: "12345678910", email:"samperisi.samuel@gmail.com"});
            status.should.be.equal(400);
        });
    });
    describe("test validate", () => {
        let verify: string;
        before(async () => {
            verify = (await request(app).post(`${pathUser}signup`).send({...user})).body.verify;
        });
        after(async () => {
            await dropUserDB();
        });
        it("test 404 for incorrect validation", async () => {
            const { status } = await request(app).get(`${pathUser}validate/nsonoanxpsanoaosnmak`);
            status.should.be.equal(404);
        });
        it("test 200 for right validation", async () => {
            const { status } = await request(app).get(`${pathUser}validate/${verify}`);
            status.should.be.equal(200);
        });
    });
    describe("test login", () => {
        let newUser: User;
        before(async () => {
            newUser = (await request(app).post(`${pathUser}signup`).send({...user})).body;
        });
        after(async () => {
            await dropUserDB();
        });
        it("test 404 for missing verify", async () => {
            const { status } = await request(app).post(`${pathUser}login`).send({email: user.email, password: user.password});
            status.should.be.equal(404);
        });
        it("test 404 for user not found", async () => {
            const { status } = await request(app).post(`${pathUser}login`).send({email: "emailacaso@gmail.com", password: "12345678910"});
            status.should.be.equal(404);
        });
        it("test 200 for right login", async () => {
            await request(app).get(`${pathUser}validate/${newUser.verify}`);
            const { body, status } = await request(app).post(`${pathUser}login`).send({email: user.email, password: user.password});

            status.should.be.equal(200);
            (body.token).should.be.not.empty;
        });
        it("test 401 for unauthorized", async () => {
            const { status } = await request(app).post(`${pathUser}login`).send({email: user.email, password: "wrong password"});
            status.should.be.equal(401);
        });
    });
    describe("test me", async () => {
        let newUser: User;
        before(async () => {
            newUser = (await request(app).post(`${pathUser}signup`).send({...user})).body;
            await request(app).get(`${pathUser}validate/${newUser.verify}`);
            newUser = (await request(app).post(`${pathUser}login`).send({email: user.email, password: user.password})).body;
        });
        after(async () => {
            await dropUserDB();
        });
        it("test 401 for invalid token", async () => {
            const { status } = await request(app).get(`${pathUser}me`).set({authorization: "wrong-token"});
            status.should.be.equal(401);
        });
        it("test 200 for right token", async () => {
            const { body, status } = await request(app).get(`${pathUser}me`).set({authorization: newUser.token});

            status.should.be.equal(200);
            body.should.have.property("id");
            body.should.have.property("email");
            body.should.have.property("username");
            body.should.have.property("cityFavorites");
        });
    });
    describe("test reauthorization", () => {
        let newUser: User;
        before(async () => {
            newUser = (await request(app).post(`${pathUser}signup`).send({...user})).body;
            await request(app).get(`${pathUser}validate/${newUser.verify}`);
            newUser = (await request(app).post(`${pathUser}login`).send({email: user.email, password: user.password})).body;
        });
        after(async () => {
            await dropUserDB();
        });
        it("test 200 for right refreshToken", async () => {
            const { body, status } = await request(app).get(`${pathUser}reauthorization`).set({authorization: newUser.refreshToken});

            status.should.be.equal(200);
            body.should.have.property("token");
            body.should.have.property("refreshToken");
        });
        it("test 401 for invalid refreshToken", async () => {
            const { status } = await request(app).get(`${pathUser}reauthorization`).set({authorization: "wrong-refresh-token"});
            status.should.be.equal(401);
        });
        it("test 200 for valid new tokens", async () => {
            const { body } = await request(app).get(`${pathUser}reauthorization`).set({authorization: newUser.refreshToken});
            body.should.have.property("token");
            body.should.have.property("refreshToken");

            const { status: status1 } = await request(app).get(`${pathUser}me`).set({authorization: body.token});
            status1.should.be.equal(200);

            const { status: status2 } = await request(app).get(`${pathUser}reauthorization`).set({authorization: body.refreshToken});
            status2.should.be.equal(200);
        });
    });
    describe("test favorites", () => {
        let newUser: User;
        before(async () => {
            newUser = (await request(app).post(`${pathUser}signup`).send({...user})).body;
            await request(app).get(`${pathUser}validate/${newUser.verify}`);
            newUser = (await request(app).post(`${pathUser}login`).send({email: user.email, password: user.password})).body;
        });
        after(async () => {
            await dropUserDB();
        });
        it("test 201 for right push city", async () => {
            const { status } = await request(app).post(`${pathUserFavorites}/Roma`).set({authorization: newUser.token});
            status.should.be.equal(201);

            const { body } = await request(app).get(`${pathUserFavorites}`).set({authorization: newUser.token});
            body.should.have.length(1);
        });
        it("test 409 for city already present", async () => {
            const { status } = await request(app).post(`${pathUserFavorites}/Roma`).set({authorization: newUser.token});
            status.should.be.equal(409);
        });
        it("test 200 for right get city", async () => {
            const { body, status } = await request(app).get(`${pathUserFavorites}`).set({authorization: newUser.token});

            status.should.be.equal(200);
            body.should.have.length(1);
        });
        it("test 404 for city to be deleted not found", async () => {
            const { status } = await request(app).delete(`${pathUserFavorites}/Catania`).set({authorization: newUser.token});
            status.should.be.equal(404);
        });
        it("test 200 for right city deleted", async () => {
            const { status } = await request(app).delete(`${pathUserFavorites}/Roma`).set({authorization: newUser.token});
            status.should.be.equal(200);

            const { body } = await request(app).get(`${pathUserFavorites}`).set({authorization: newUser.token});
            body.should.have.length(0);
        });
        it("test 401 for invalid token(post)", async () => {
            const { status } = await request(app).post(`${pathUserFavorites}/Roma`).set({authorization: "wrong-token"});
            status.should.be.equal(401);
        });
        it("test 401 for invalid token(get)", async () => {
            const { status } = await request(app).get(`${pathUserFavorites}`).set({authorization: "wrong-token"});
            status.should.be.equal(401);
        });
        it("test 401 for invalid token(delete)", async () => {
            const { status } = await request(app).delete(`${pathUserFavorites}/Roma`).set({authorization: "wrong-token"});
            status.should.be.equal(401);
        });
    });
});