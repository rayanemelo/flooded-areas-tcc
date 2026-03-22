import axios, { AxiosError } from 'axios';
import { FloodAreaAiAnalysisEntity } from '../../../domain/entities/flood-area-ai-analysis/flood-area-ai-analysis-entity';
import { IFloodAreaAiAnalysisRepository } from '../../../domain/repositories/flood-area-ai-analysis/flood-area-ai-analysis-repository';
import { Exception } from '../../exception/exception';
import { handleRequestError } from '../../exception/handleRequestError';

export class FloodAreaAiAnalysisHttpRepository
  implements IFloodAreaAiAnalysisRepository
{
  async analyzeFloodAreaImage(
    imageUrl: string
  ): Promise<FloodAreaAiAnalysisEntity> {
    const iaServiceUrl = process.env.IA_SERVICE_URL;
    const analyzePath = process.env.IA_SERVICE_ANALYZE_IMAGE_PATH || '/analyze';

    if (!iaServiceUrl) {
      throw new Exception(500, 'IA service URL is not configured');
    }

    try {
      const endpoint = new URL(analyzePath, iaServiceUrl).toString();
      // console.log("imageUrl: ", imageUrl);

      const response = await axios.post(endpoint, {
        imageUrl,
      });
      // console.log("response: ", response);

      const data = (response.data || {}) as Record<string, unknown>;

      return new FloodAreaAiAnalysisEntity({
        imageUrl,
        isFlood: typeof data.isFlood === 'boolean' ? data.isFlood : null,
        confidence:
          typeof data.confidence === 'number' ? data.confidence : null,
        veracityScore:
          typeof data.veracityScore === 'number' ? data.veracityScore : null,
        analysis: typeof data.analysis === 'string' ? data.analysis : null,
        metadata: data,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        handleRequestError(error);
        throw new Exception(502, 'Error while analyzing image in IA service');
      }

      throw new Exception(500, 'Unexpected error while analyzing image');
    }
  }
}
