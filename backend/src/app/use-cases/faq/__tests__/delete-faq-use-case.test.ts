import { faker } from '@faker-js/faker';
import { FaqMockFactory } from '../../../../test/factories/faq/faq-factory-mock';
import { FaqRepositoryMock } from '../../../../test/repositories/faq/faq-repository-mock';
import { DeleteFaqUseCase } from '../delete-faq-use-case';
import { Exception } from '../../../../infra/exception/exception';

describe('Delete FAQ Use Case', () => {
  let useCase: DeleteFaqUseCase;

  beforeEach(() => {
    useCase = new DeleteFaqUseCase(FaqRepositoryMock);
    jest.clearAllMocks();
  });

  it('should delete FAQ by ID successfully', async () => {
    // Arrange
    const id = faker.number.int();
    const mockFaq = FaqMockFactory.createEntity();

    FaqRepositoryMock.getFaqById.mockResolvedValueOnce(mockFaq);

    // Act
    const result = await useCase.execute(id);

    // Assert
    expect(result).toBeUndefined();
    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledTimes(1);
    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledWith(id);
    expect(FaqRepositoryMock.deleteFaq).toHaveBeenCalledTimes(1);
    expect(FaqRepositoryMock.deleteFaq).toHaveBeenCalledWith(id);
  });

  it('should throw a not found exception when FAQ does not exists', async () => {
    // Arrange
    const id = faker.number.int();

    FaqRepositoryMock.getFaqById.mockResolvedValueOnce(null);

    // Act
    await expect(useCase.execute(id)).rejects.toThrow(Exception);
    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledTimes(1);

    // Assert
    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledTimes(1);
    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledWith(id);
    expect(FaqRepositoryMock.deleteFaq).not.toHaveBeenCalled();
  });
});
