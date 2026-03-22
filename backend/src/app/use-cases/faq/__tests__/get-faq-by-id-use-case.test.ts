import { faker } from '@faker-js/faker';
import { FaqMockFactory } from '../../../../test/factories/faq/faq-factory-mock';
import { FaqRepositoryMock } from '../../../../test/repositories/faq/faq-repository-mock';
import { GetFaqByIdUseCase } from '../get-faq-by-id-use-case';
import { Exception } from '../../../../infra/exception/exception';

describe('Get FAQ by ID Use Case', () => {
  let useCase: GetFaqByIdUseCase;

  beforeEach(() => {
    useCase = new GetFaqByIdUseCase(FaqRepositoryMock);
    jest.clearAllMocks();
  });

  it('should get FAQ by ID successfully', async () => {
    // Arrange
    const mockFaq = FaqMockFactory.createEntity();

    FaqRepositoryMock.getFaqById.mockResolvedValueOnce(mockFaq);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockFaq);
  });

  it('should throw a not found exception when FAQ does not exists', async () => {
    // Arrange
    const id = faker.number.int();

    FaqRepositoryMock.getFaqById.mockResolvedValueOnce(null);

    // Act
    await expect(useCase.execute(id)).rejects.toThrow(Exception);

    // Assert
    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledTimes(1);
    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledWith(id);
  });
});
