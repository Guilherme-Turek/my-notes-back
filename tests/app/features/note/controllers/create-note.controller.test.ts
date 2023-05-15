import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { CreateNoteUsecase } from "../../../../../src/app/features/note/usecases/create-note.usecase";
import { NoteController } from "../../../../../src/app/features/note/controllers/note.controller";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { Note } from "../../../../../src/app/models/note.model";
describe("Create note controller tests", () => {
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
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(new User("anyusername", "anypassword"));

    jest
      .spyOn(NoteRepository.prototype, "create")
      .mockResolvedValue(new Note("anytitle", "anydescription", "anyiduser"));

    jest.spyOn(CreateNoteUsecase.prototype, "execute").mockResolvedValue({
      ok: true,
      code: 201,
      message: "Note created",
      data: {},
    });

    const result = await request(app).post("/users/:idUser/notes").send({
      title: "anytitle",
      description: "anydescription",
      idUSer: "anyiduser",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(201);
  });

  test("deve retornar status 500 quando o usecase gerar exception", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(null);
    jest
      .spyOn(CreateNoteUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado usecase");
      });

    const result = await request(app).post("/users/:idUser/notes").send({
      title: "anytitle",
      description: "anydescription",
      idUser: "anyidUser",
    });

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(500);
    expect(result).toHaveProperty(
      "body.message",
      "Error: Erro simulado usecase"
    );
  });
});
