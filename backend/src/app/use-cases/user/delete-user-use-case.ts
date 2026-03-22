import { IUserRepository } from '../../../domain/repositories/user/user-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    const userExists = await this.userRepository.getUserById(id);

    if (!userExists) throw new Exception(404, messages.response.userNotFound);

    await this.userRepository.deleteUser(id);
  }
}
