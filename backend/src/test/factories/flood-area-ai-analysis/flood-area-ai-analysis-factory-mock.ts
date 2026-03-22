import { faker } from '@faker-js/faker';
import { FloodAreaAiAnalysisEntity } from '../../../domain/entities/flood-area-ai-analysis/flood-area-ai-analysis-entity';

export class FloodAreaAiAnalysisFactoryMock {
  public static createEntity(
    data: Partial<FloodAreaAiAnalysisEntity> = {}
  ): FloodAreaAiAnalysisEntity {
    return {
      imageUrl: faker.image.url(),
      isFlood: faker.datatype.boolean(),
      confidence: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      veracityScore: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      analysis: faker.lorem.sentence(),
      metadata: {
        source: 'tcc-ia-service',
      },
      ...data,
    };
  }
}
