import { UpdateFaqUseCase } from '../update-faq-use-case';
import { FaqMockFactory } from '../../../../test/factories/faq/faq-factory-mock';
import { FaqRepositoryMock } from '../../../../test/repositories/faq/faq-repository-mock';
import { faker } from '@faker-js/faker';
import { Exception } from '../../../../infra/exception/exception';

describe('Update FAQ Use Case', () => {
  let useCase: UpdateFaqUseCase;

  beforeEach(() => {
    useCase = new UpdateFaqUseCase(FaqRepositoryMock);
    jest.clearAllMocks();
  });

  it('should update an existing FAQ', async () => {
    // Arrange
    const mockFaq = FaqMockFactory.createEntity();

    FaqRepositoryMock.getFaqById.mockResolvedValueOnce(mockFaq);
    FaqRepositoryMock.updateFaq.mockResolvedValueOnce(mockFaq);

    // Act
    const result = await useCase.execute(mockFaq.id, {
      question: mockFaq.question,
      answer: mockFaq.answer,
    });

    // Assert
    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledWith(mockFaq.id);
    expect(FaqRepositoryMock.updateFaq).toHaveBeenCalledWith(
      mockFaq.id,
      expect.objectContaining({
        question: mockFaq.question,
        answer: mockFaq.answer,
      })
    );
    expect(result).toEqual(mockFaq);
  });

  it('should throw an error if FAQ doesnt exist', async () => {
    // Arrange
    const id = faker.number.int();
    const mockFaq = FaqMockFactory.createEntity();

    FaqRepositoryMock.getFaqById.mockResolvedValueOnce(null);

    // Act & Assert
    await expect(useCase.execute(id, mockFaq)).rejects.toThrow(Exception);

    expect(FaqRepositoryMock.getFaqById).toHaveBeenCalledWith(id);
    expect(FaqRepositoryMock.updateFaq).not.toHaveBeenCalled();
  });
});
