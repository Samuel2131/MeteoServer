
import request from "supertest";
import { app } from "../app";
import { should } from "chai";

const pathCurrentWeather = "/v1/currentWeather/";
const pathAirQuality = "/v1/airQuality/";
const pathForecastWeather = "/v1/forecastWeather/";

should();

describe("endpoints weather", () => {
    describe("test currentWeather", () => {
        it("test 404 for city not found", async () => {
            const { status } = await request(app).get(`${pathCurrentWeather}/CasualCity`);
            status.should.be.equal(404);
        });
        it("test 200 for currentWeather", async () => {
            const { body, status } = await request(app).get(`${pathCurrentWeather}/Rome`);

            status.should.be.equal(200);
            body.name.should.be.equal("Rome");
        });
    });
    describe("test airQuality", () => {
        it("test 404 for city not found", async () => {
            const { status } = await request(app).get(`${pathAirQuality}/CasualCity`);
            status.should.be.equal(404);
        });
        it("test 200 for airQuality", async () => {
            const { body, status } = await request(app).get(`${pathAirQuality}/Rome`);
            status.should.be.equal(200);

            body.should.have.property("list");
            body.should.have.property("coord");
        });
    });
    describe("test forecastWeather", () => {
        it("test 404 for city not found", async () => {
            const { status } = await request(app).get(`${pathForecastWeather}/CasualCity`);
            status.should.be.equal(404);
        });
        it("test 200 for forecastWeather", async () => {
            const { status } = await request(app).get(`${pathForecastWeather}/Rome`);
            status.should.be.equal(200);
        });
        it("test limit media query", async () => {
            const { body, status } = await request(app).get(`${pathForecastWeather}/Rome?limit=4`);

            status.should.be.equal(200);
            (body.list).should.have.length(4);
        });
        it("test invalid value of limit", async () => {
            const { status } = await request(app).get(`${pathForecastWeather}/Rome?limit=7`);
            status.should.be.equal(400);

            const { status: status1 } = await request(app).get(`${pathForecastWeather}/Rome?limit=-4`);
            status1.should.be.equal(400);

            const { status: status2 } = await request(app).get(`${pathForecastWeather}/Rome?limit=err`);
            status2.should.be.equal(400);
        });
    });
});

