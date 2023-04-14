import { TypeormConnection } from "../../../../main/database/typeorm.connection";
import { User } from "../../../models/user.model";
import { UserEntity } from "../../../shared/database/entities/user.entity";

export class UserRepository {
  private repository = TypeormConnection.connection.getRepository(UserEntity);

  public async create(user: User) {
    const userEntity = this.repository.create({
      id: user.id,
      username: user.username,
      password: user.password,
    });

    const result = await this.repository.save(userEntity);
    return UserRepository.mapEntityToModel(result);
  }

  public async getByUsername(
    username: string,
    password?: string
  ): Promise<User | null> {
    const result = await this.repository.findOneBy({
      username,
      password,
    });

    if (!result) {
      return null;
    }

    return UserRepository.mapEntityToModel(result);
  }

  public async get(id: string) {
    const result = await this.repository.findOneBy({
      id,
    });

    if (!result) {
      return null;
    }

    return UserRepository.mapEntityToModel(result);
  }

  public static mapEntityToModel(entity: UserEntity): User {
    return User.create(entity.id, entity.username, entity.password);
  }
}
