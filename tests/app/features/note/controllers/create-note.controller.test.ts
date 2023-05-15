import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { CreateNoteUsecase } from "../../../../../src/app/features/note/usecases/create-note.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
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

  test("deveria retornar 400 se o title não for informado", async () => {
    const result = await request(app).post("/users/:idUser/notes").send({
      description: "anydescription",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Title was not provided!");
  });

  test("deveria retornar 400 se a descrição não for informado", async () => {
    const result = await request(app).post("/users/:idUser/notes").send({
      title: "anytitle",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty(
      "body.message",
      "Description was not provided!"
    );
  });

  test("deveria retornar status 201 quando o usecase executar com sucesso ", async () => {
    jest.spyOn(CreateNoteUsecase.prototype, "execute").mockResolvedValue({
      ok: true,
      code: 201,
      message: "Note created",
      data: {},
    });

    const result = await request(app).post("/users/:idUser/notes").send({
      title: "anytitle",
      description: "anydescription",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(201);
  });
});
