import { IUserRepository } from '../../../domain/repositories/user/user-repository';
import { messages } from '../../../infra/config/messages';
import { Exception } from '../../../infra/exception/exception';

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number) {
    const user = await this.userRepository.getUserById(id);

    if (!user) throw new Exception(404, messages.response.userNotFound);

    return user;
  }
}
