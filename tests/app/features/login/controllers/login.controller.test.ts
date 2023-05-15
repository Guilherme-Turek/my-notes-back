import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { LoginUsecase } from "../../../../../src/app/features/login/usecases/login.usecase";
describe("Create user controller tests", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const app = createApp();

  test("deve retornar 400 se o nome não for informado", async () => {
    const result = await request(app).post("/login").send({
      username: "",
      password: "anypassword",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Username was not provided!");
  });

  test("deve retornar 400 se a senha não for informado", async () => {
    const result = await request(app).post("/login").send({
      username: "anyusername",
      password: "",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Password was not provided!");
  });

  test("deve retornar 200 se o usecase for executado", async () => {
    jest.spyOn(LoginUsecase.prototype, "execute").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Login successfully",
      data: {},
    });

    const result = await request(app).post("/login").send({
      username: "anyusername",
      password: "anypassword",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
  });
});
