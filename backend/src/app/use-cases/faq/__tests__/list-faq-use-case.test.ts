import { FaqMockFactory } from '../../../../test/factories/faq/faq-factory-mock';
import { FaqRepositoryMock } from '../../../../test/repositories/faq/faq-repository-mock';
import { ListFaqUseCase } from '../list-faq-use-case';

describe('List FAQs Use Case', () => {
  let useCase: ListFaqUseCase;

  beforeEach(() => {
    useCase = new ListFaqUseCase(FaqRepositoryMock);
    jest.clearAllMocks();
  });

  it('should list all FAQs', async () => {
    // Arrange
    const mockFaqs = FaqMockFactory.createEntities(5);
    FaqRepositoryMock.listFaqs.mockResolvedValueOnce(mockFaqs);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(FaqRepositoryMock.listFaqs).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockFaqs);
  });
});
