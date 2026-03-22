import { FloodAreaAiAnalysisEntity } from '../../../domain/entities/flood-area-ai-analysis/flood-area-ai-analysis-entity';
import { IFloodAreaAiAnalysisRepository } from '../../../domain/repositories/flood-area-ai-analysis/flood-area-ai-analysis-repository';

export const FloodAreaAiAnalysisRepositoryMock: jest.Mocked<IFloodAreaAiAnalysisRepository> =
  {
    analyzeFloodAreaImage: jest.fn<Promise<FloodAreaAiAnalysisEntity>, [string]>(),
  };
