import { UserEntity } from '../../../domain/entities/user/user-entity';
import { IUserRepository } from '../../../domain/repositories/user/user-repository';

export type UserDTO = {
  phone: string;
  latitude: string;
  longitude: string;
};

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(body: UserDTO): Promise<UserEntity> {
    const user = await this.userRepository.createUser(new UserEntity(body));
    return user;
  }
}
