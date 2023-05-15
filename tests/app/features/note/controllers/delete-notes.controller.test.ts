import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { ListNotesUsecase } from "../../../../../src/app/features/note/usecases/list-notes.usecase";
import { DeleteNoteUsecase } from "../../../../../src/app/features/note/usecases/delete-note.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
describe("delete note controller tests", () => {
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
    jest.spyOn(DeleteNoteUsecase.prototype, "execute").mockResolvedValue({
      ok: true,
      code: 200,
      message: "Note deleted",
    });

    const result = await request(app).delete("/users/:idUser/notes/id");
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
  });

  test("deve retornar status 500 quando o usecase gerar exception", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByUsername")
      .mockResolvedValue(null);
    jest.spyOn(NoteRepository.prototype, "getById").mockResolvedValue(null);
    jest
      .spyOn(DeleteNoteUsecase.prototype, "execute")
      .mockImplementation((_: any) => {
        throw new Error("Erro simulado usecase");
      });

    const result = await request(app).delete("/users/:idUser/notes/:id").send({
      idUser: "anyidUser",
      id: "anyid",
    });

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(500);
    expect(result).toHaveProperty(
      "body.message",
      "Error: Erro simulado usecase"
    );
  });
});
