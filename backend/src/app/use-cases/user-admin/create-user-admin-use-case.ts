import { UserAdminEntity } from '../../../domain/entities/user-admin/user-admin-entity';
import { IUserAdminRepository } from '../../../domain/repositories/user-admin/user-admin-repository';

export type UserAdminDTO = {
  name: string;
  email: string;
  password: string;
};

export class CreateUserAdminUseCase {
  constructor(private userAdminRepository: IUserAdminRepository) {}

  async execute(body: UserAdminDTO): Promise<UserAdminEntity> {
    const user = await this.userAdminRepository.createUserAdmin(
      new UserAdminEntity(body)
    );

    return user;
  }
}
