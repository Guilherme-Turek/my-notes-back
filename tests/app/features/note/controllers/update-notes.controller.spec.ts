import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { UpdateNoteUsecase } from "../../../../../src/app/features/note/usecases/update-note.usercase";
import { NoteStatus } from "../../../../../src/app/models/note.model";
import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { RedisConnection } from "../../../../../src/main/database/redis.connections";
describe("update note controller tests", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const app = createApp();

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
