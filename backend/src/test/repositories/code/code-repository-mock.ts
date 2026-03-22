import { ICodeRepository } from '../../../domain/repositories/code/code-repository';

export const CodeRepositoryMock: jest.Mocked<ICodeRepository> = {
  getCodeByUserId: jest.fn(),
  createCode: jest.fn(),
  updateCode: jest.fn(),
};
