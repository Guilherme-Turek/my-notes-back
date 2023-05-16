import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { LoginUsecase } from "../../../../../src/app/features/login/usecases/login.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
import { User } from "../../../../../src/app/models/user.model";
describe("Login user controller integration tests", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
  });

  afterEach(async () => {
    const noteRepository =
      TypeormConnection.connection.getRepository(NoteEntity);
    await noteRepository.clear();
    const userRepository =
      TypeormConnection.connection.getRepository(UserEntity);
    await userRepository.clear();
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

  test("deve retornar erro(404) se não encontrar usuário", async () => {
    const result = await request(app).post("/login").send({
      username: "anyusername",
      password: "anypassword",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(404);
  });

  test("deve retornar 200 se o usecase for executado", async () => {
    const userRepository =
      TypeormConnection.connection.getRepository(UserEntity);

    const newUser = userRepository.create(
      new User("anyusername", "anypassword")
    );

    await userRepository.save(newUser);

    const result = await request(app).post("/login").send({
      username: "anyusername",
      password: "anypassword",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
  });

  test("deve retornar status 500 quando o usecase gerar exception", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(null);
    jest
      .spyOn(LoginUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado usecase");
      });

    const result = await request(app).post("/login").send({
      username: "anyusername",
      password: "anypassword",
    });

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(500);
    expect(result).toHaveProperty(
      "body.message",
      "Error: Erro simulado usecase"
    );
  });
});
