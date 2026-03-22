import { FaqMockFactory } from '../../../../test/factories/faq/faq-factory-mock';
import { FaqRepositoryMock } from '../../../../test/repositories/faq/faq-repository-mock';
import { CreateFaqUseCase } from '../create-faq-use-case';

describe('Create FAQ Use Case', () => {
  let useCase: CreateFaqUseCase;

  beforeEach(() => {
    useCase = new CreateFaqUseCase(FaqRepositoryMock);
    jest.clearAllMocks();
  });

  it('should create a new FAQ', async () => {
    // Arrange
    const mockFaq = FaqMockFactory.createEntity();
    FaqRepositoryMock.createFaq.mockResolvedValueOnce(mockFaq);

    // Act
    const result = await useCase.execute(mockFaq);

    // Assert
    expect(FaqRepositoryMock.createFaq).toHaveBeenCalledWith(mockFaq);
    expect(result).toEqual(mockFaq);
  });

  it('should throw an error if FAQ creation fails', async () => {
    // Arrange
    const mockFaq = FaqMockFactory.createEntity();
    const errorMessage = 'Error creating FAQ';
    FaqRepositoryMock.createFaq.mockRejectedValueOnce(new Error(errorMessage));

    // Act & Assert
    await expect(useCase.execute(mockFaq)).rejects.toThrow(errorMessage);
  });
});
