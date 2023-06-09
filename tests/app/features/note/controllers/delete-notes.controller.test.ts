import request from "supertest";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { NoteEntity } from "../../../../../src/app/shared/database/entities/note.entity";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { User } from "../../../../../src/app/models/user.model";
import { Note } from "../../../../../src/app/models/note.model";
import { RedisConnection } from "../../../../../src/main/database/redis.connections";
describe("delete note controller integration tests", () => {
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
    const result = await request(app).delete("/users/:idUser/notes/:id").send({
      title: "anytitle",
      description: "anydescription",
      idUser: "anyiduser",
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(404);
  });

  test("deveria retornar status 404 quando não encontrar nota ", async () => {
    const userRepository =
      TypeormConnection.connection.getRepository(UserEntity);

    const newUser = userRepository.create(
      new User("anyusername", "anypassword")
    );

    await userRepository.save(newUser);

    const result = await request(app).delete(`/users/${newUser.id}/notes/:id`);

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(404);
  });

  test("deveria retornar status 200 quando o usecase executar com sucesso ", async () => {
    const userRepository =
      TypeormConnection.connection.getRepository(UserEntity);

    const newUser = userRepository.create(
      new User("anyusername", "anypassword")
    );

    await userRepository.save(newUser);

    const noteRepository =
      TypeormConnection.connection.getRepository(NoteEntity);

    const newNote = noteRepository.create(
      new Note("anytitle", "anydescription", newUser.id)
    );

    await noteRepository.save(newNote);

    const result = await request(app).delete(
      `/users/${newUser.id}/notes/${newNote.id}`
    );

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
  });
});
