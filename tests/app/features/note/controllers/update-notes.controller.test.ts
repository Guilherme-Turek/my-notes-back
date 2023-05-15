import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { ListNotesUsecase } from "../../../../../src/app/features/note/usecases/list-notes.usecase";
import { UpdateNoteUsecase } from "../../../../../src/app/features/note/usecases/update-note.usercase";
import { NoteStatus } from "../../../../../src/app/models/note.model";
import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { DeleteNoteUsecase } from "../../../../../src/app/features/note/usecases/delete-note.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
describe("update note controller tests", () => {
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

  test("deveria retornar status 200 quando o usecase executar com sucesso ", async () => {
    jest.spyOn(UpdateNoteUsecase.prototype, "execute").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Note updated",
      data: {
        id: "anyid",
        title: "anytitle",
        description: "anydescription",
        status: NoteStatus.active,
      },
    });

    const result = await request(app).put("/users/:idUser/notes/id").send({
      id: "anyid",
      idUser: "anyiduser",
      title: "anytitle",
      description: "anydescription",
      status: NoteStatus.active,
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
  });

  test("deve retornar status 500 quando o usecase gerar exception", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(null);
    jest.spyOn(NoteRepository.prototype, "getById").mockResolvedValue(null);
    jest
      .spyOn(UpdateNoteUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado usecase");
      });

    const result = await request(app).put("/users/:idUser/notes/:id").send({
      idUser: "anyidUser",
      id: "anyid",
      title: "anytitle",
      description: "anydescription",
      status: NoteStatus.filed,
    });

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(500);
    expect(result).toHaveProperty(
      "body.message",
      "Error: Erro simulado usecase"
    );
  });
});
