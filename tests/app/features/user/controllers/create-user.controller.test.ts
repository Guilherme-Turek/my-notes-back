import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create-user.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
describe("Create user controller integration tests", () => {
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

  afterEach(async () => {
    const noteRepository =
      TypeormConnection.connection.getRepository(NoteEntity);
    await noteRepository.clear();
    const userRepository =
      TypeormConnection.connection.getRepository(UserEntity);
    await userRepository.clear();
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

  test("deveria retornar status 400 se o usuário já existir ", async () => {
    const userRepository =
      TypeormConnection.connection.getRepository(UserEntity);
    const user = await userRepository.create({
      id: "anyid",
      username: "anyusername",
      password: "anypassword",
    });

    await userRepository.save(user);

    const result = await request(app).post("/users").send({
      username: "anyusername",
      password: "anypassword",
      confirmPassword: "anypassword",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(400);
  });

  test("deveria retornar status 201 quando o usecase executar com sucesso ", async () => {
    const result = await request(app).post("/users").send({
      username: "anyusername",
      password: "anypassword",
      confirmPassword: "anypassword",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(201);
  });

  test("deve retornar status 500 quando o usecase gerar exception", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(null);
    jest
      .spyOn(CreateUserUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado usecase");
      });

    const result = await request(app).post("/users").send({
      username: "anyusername",
      password: "anypassword",
      confirmPassword: "anypassword",
    });

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(500);
    expect(result).toHaveProperty(
      "body.message",
      "Error: Erro simulado usecase"
    );
  });
});
