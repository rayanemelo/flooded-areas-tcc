import { AnalyzeFloodAreaImageUseCase } from '../analyze-flood-area-image-use-case';
import { FloodAreaAiAnalysisFactoryMock } from '../../../../test/factories/flood-area-ai-analysis/flood-area-ai-analysis-factory-mock';
import { FloodAreaAiAnalysisRepositoryMock } from '../../../../test/repositories/flood-area-ai-analysis/flood-area-ai-analysis-repository-mock';

describe('Analyze Flood Area Image Use Case', () => {
  let useCase: AnalyzeFloodAreaImageUseCase;

  beforeEach(() => {
    useCase = new AnalyzeFloodAreaImageUseCase(FloodAreaAiAnalysisRepositoryMock);
    jest.clearAllMocks();
  });

  it('should analyze image successfully', async () => {
    const mockAnalysis = FloodAreaAiAnalysisFactoryMock.createEntity();

    FloodAreaAiAnalysisRepositoryMock.analyzeFloodAreaImage.mockResolvedValueOnce(
      mockAnalysis
    );

    const result = await useCase.execute(mockAnalysis.imageUrl);

    expect(result).toEqual(mockAnalysis);
    expect(
      FloodAreaAiAnalysisRepositoryMock.analyzeFloodAreaImage
    ).toHaveBeenCalledWith(mockAnalysis.imageUrl);
  });
});
