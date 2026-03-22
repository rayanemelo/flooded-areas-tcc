interface CreateFloodAreaAiAnalysisEntityArgs {
  imageUrl: string;
  isFlood?: boolean | null;
  confidence?: number | null;
  veracityScore?: number | null;
  analysis?: string | null;
  metadata?: Record<string, unknown> | null;
}

export class FloodAreaAiAnalysisEntity {
  imageUrl: string;
  isFlood: boolean | null;
  confidence: number | null;
  veracityScore: number | null;
  analysis: string | null;
  metadata: Record<string, unknown> | null;

  constructor(data: CreateFloodAreaAiAnalysisEntityArgs) {
    this.imageUrl = data.imageUrl;
    this.isFlood = data.isFlood ?? null;
    this.confidence = data.confidence ?? null;
    this.veracityScore = data.veracityScore ?? null;
    this.analysis = data.analysis ?? null;
    this.metadata = data.metadata ?? null;
  }
}
