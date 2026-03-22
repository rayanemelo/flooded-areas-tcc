import { FloodAreaAiAnalysisEntity } from '../../entities/flood-area-ai-analysis/flood-area-ai-analysis-entity';

export interface IFloodAreaAiAnalysisRepository {
  analyzeFloodAreaImage(imageUrl: string): Promise<FloodAreaAiAnalysisEntity>;
}
