import { CodeEntity } from '../../../domain/entities/code/code-entity';
import { ICodeRepository } from '../../../domain/repositories/code/code-repository';
import { prisma } from '../../database';

export class CodeRepositoryPrisma implements ICodeRepository {
  async getCodeByUserId(userId: number): Promise<CodeEntity | null> {
    return await prisma.code.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  async createCode(code: CodeEntity): Promise<CodeEntity> {
    return await prisma.code.create({
      data: code,
    });
  }

  async updateCode(id: number, data: Partial<CodeEntity>): Promise<CodeEntity> {
    return await prisma.code.update({
      where: {
        id: Number(id),
      },
      data: data,
    });
  }
}
