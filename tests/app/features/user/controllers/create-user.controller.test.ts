import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
describe("Create user controller unit tests", () => {
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

  test("deveria retornar 400 se o nome não for informado", async () => {
    const result = await request(app).post("/users").send({});

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Username was not provided!");
  });

  test("deveria retornar 400 se a senha não for informado", async () => {
    const result = await request(app).post("/users").send({
      username: "anyusername",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Password was not provided!");
  });

  test("deveria retornar 400 se a confirmação da senha não for informado", async () => {
    const result = await request(app).post("/users").send({
      username: "anyusername",
      password: "anypassword",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty(
      "body.message",
      "Confirm password was not provided!"
    );
  });

  test("deveria retornar 403 se a senha e a confirmação de senha não forem iguais", async () => {
    const result = await request(app).post("/users").send({
      username: "anyusername",
      password: "anypassword",
      confirmPassword: "anyconfirmpassword",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 401);
    expect(result).toHaveProperty("body.message", "Passwords do not match");
  });

  test("deveria retornar status 201 quando o usecase executar com sucesso ", async () => {
    jest.spyOn(CreateUserUsecase.prototype, "execute").mockResolvedValue({
      ok: true,
      code: 201,
      message: "User created",
      data: {},
    });

    const result = await request(app).post("/users").send({
      username: "anyname",
      password: "anypassword",
      confirmPassword: "anypassword",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(201);
  });
});
