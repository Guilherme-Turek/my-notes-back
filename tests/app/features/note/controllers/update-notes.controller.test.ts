import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { UpdateNoteUsecase } from "../../../../../src/app/features/note/usecases/update-note.usercase";
import { Note, NoteStatus } from "../../../../../src/app/models/note.model";
import { NoteRepository } from "../../../../../src/app/features/note/repository/note.repository";
import { UserRepository } from "../../../../../src/app/features/user/repository/user.repository";
import { RedisConnection } from "../../../../../src/main/database/redis.connections";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
describe("update note controller tests", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
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

  test("deve retornar 404 quando não encontrar usuário ", async () => {
    const result = await request(app).put("/users/:idUser/notes/:id").send({
      id: "anyid",
      title: "anytitle",
      description: "anydescription",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(404);
  });

  test("deve retornar 404 quando não encontrar nota ", async () => {
    const result = await request(app).put("/users/:idUser/notes").send({
      title: "anytitle",
      description: "anydescription",
      idUser: "anyiduser",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(404);
  });

  test.skip("deveria retornar status 200 quando o usecase executar com sucesso ", async () => {
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
});
