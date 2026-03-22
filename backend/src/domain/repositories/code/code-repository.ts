import { CodeEntity } from '../../entities/code/code-entity';

export interface ICodeRepository {
  getCodeByUserId(userId: number): Promise<CodeEntity | null>;
  createCode(code: CodeEntity): Promise<CodeEntity>;
  updateCode(id: number, data: Partial<CodeEntity>): Promise<CodeEntity>;
}
