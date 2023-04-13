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

  public async verifyUserExist(
    username: string,
    password?: string
  ): Promise<User | null> {
    const result = await this.repository.findOne({
      where: {
        username: username,
        password: password,
      },
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
