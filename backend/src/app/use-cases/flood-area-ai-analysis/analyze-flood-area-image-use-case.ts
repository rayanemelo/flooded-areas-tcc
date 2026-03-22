import { FloodAreaAiAnalysisEntity } from '../../../domain/entities/flood-area-ai-analysis/flood-area-ai-analysis-entity';
import { IFloodAreaAiAnalysisRepository } from '../../../domain/repositories/flood-area-ai-analysis/flood-area-ai-analysis-repository';

export class AnalyzeFloodAreaImageUseCase {
  constructor(
    private floodAreaAiAnalysisRepository: IFloodAreaAiAnalysisRepository
  ) {}

  async execute(imageUrl: string): Promise<FloodAreaAiAnalysisEntity> {
    return await this.floodAreaAiAnalysisRepository.analyzeFloodAreaImage(
      imageUrl
    );
  }
}
