import { IUserRepository } from '../../../domain/repositories/user/user-repository';

export class ListUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute() {
    const users = await this.userRepository.listUsers();
    return users;
  }
}
