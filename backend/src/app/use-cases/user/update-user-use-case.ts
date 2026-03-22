import { UserEntity } from '../../../domain/entities/user/user-entity';
import { IUserRepository } from '../../../domain/repositories/user/user-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export type UpdateUserDTO = Partial<
  Pick<UserEntity, 'phone' | 'latitude' | 'longitude' | 'active'>
>;

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number, body: UpdateUserDTO): Promise<UserEntity> {
    const existingUser = await this.userRepository.getUserById(id);

    if (!existingUser) throw new Exception(404, messages.response.userNotFound);

    const updatedUser = await this.userRepository.updateUser(id, body);

    return updatedUser;
  }
}
