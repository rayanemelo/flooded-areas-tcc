import { IUserAdminRepository } from '../../../../domain/repositories/user-admin/user-admin-repository';
import { Exception } from '../../../../infra/exception/exception';
import { IHashService } from '../../../../domain/services/hash-service';
import { ITokenService } from '../../../../domain/services/token-service';
import { messages } from '../../../../infra/config/messages';

export type UserAdminResponseDTO = {
  id: number;
  name: string;
  active: boolean;
};

export type SessionResponseDTO = {
  userAdmin: UserAdminResponseDTO;
  token: string;
};

export class CreateSessionUserAdminUseCase {
  constructor(
    private userAdminRepository: IUserAdminRepository,
    private tokenService: ITokenService,
    private hashService: IHashService
  ) {}

  async execute(email: string, password: string): Promise<SessionResponseDTO> {
    const userAdminExists = await this.userAdminRepository.findByEmail(email);

    if (!userAdminExists)
      throw new Exception(404, messages.response.userNotFound);

    const passwordMatch = await this.hashService.compare(
      password,
      userAdminExists.password
    );

    if (!passwordMatch)
      throw new Exception(401, messages.response.notAuthorized);

    if (!userAdminExists.active) {
      throw new Exception(403, messages.response.inactiveUser);
    }

    const token = this.tokenService.generateToken({ id: userAdminExists.id });

    const userAdminResponse: UserAdminResponseDTO = {
      id: userAdminExists.id,
      name: userAdminExists.name,
      active: userAdminExists.active,
    };

    return {
      userAdmin: userAdminResponse,
      token,
    };
  }
}
