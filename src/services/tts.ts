import api from './api';

export interface GenerateTTSRequest {
  text: string;
  voiceId?: string;
  modelId?: string;
  format?: 'mp3' | 'wav';
  optimizeLatency?: number;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface GenerateTTSResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export const ttsService = {
  async generate(req: GenerateTTSRequest): Promise<GenerateTTSResponse> {
    const { data } = await api.post<GenerateTTSResponse>('/tts/generate', req);
    return data;
  },
};
