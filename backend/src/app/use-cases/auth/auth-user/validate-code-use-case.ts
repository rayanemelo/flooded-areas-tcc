import { UserEntity } from '../../../../domain/entities/user/user-entity';
import { ICodeRepository } from '../../../../domain/repositories/code/code-repository';
import { IUserRepository } from '../../../../domain/repositories/user/user-repository';
import { ITokenService } from '../../../../domain/services/token-service';
import { messages } from '../../../../infra/config/messages';
import { Exception } from '../../../../infra/exception/exception';

export class ValidateCodeUseCase {
  constructor(
    private userRepository: IUserRepository,
    private codeRepository: ICodeRepository,
    private tokenService: ITokenService
  ) {}

  async execute(
    phone: string,
    code: string
  ): Promise<{ token: string; user: UserEntity }> {
    const user = await this.userRepository.getUserByPhone(phone);

    if (!user) {
      throw new Exception(404, messages.response.userNotFound);
    }

    const codeEntity = await this.codeRepository.getCodeByUserId(user.id);

    if (!codeEntity) {
      throw new Exception(404, messages.response.codeNotFound);
    }

    if (codeEntity.code !== code) {
      throw new Exception(400, messages.response.invalidCode);
    }

    const now = new Date();

    if (codeEntity.dateExp && now > codeEntity.dateExp) {
      throw new Exception(400, messages.response.expiredCode);
    }

    const token = this.tokenService.generateToken({ user: user });

    const twentyMinutes = 20 * 60 * 1000;

    await this.codeRepository.updateCode(codeEntity.id, {
      attemptsCount: 0,
      dateExp: new Date(now.getTime() - twentyMinutes),
    });

    return {
      token,
      user,
    };
  }
}
