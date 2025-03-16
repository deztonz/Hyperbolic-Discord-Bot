const models = {
  text: {
    'meta_llama': {
      displayName: '🦙 Meta Llama 3.1 8B',
      apiModelName: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
    },
    'deepseek': {
      displayName: '🔍 DeepSeek V3',
      apiModelName: 'deepseek-ai/DeepSeek-V3',
      maxTokens: 512,
      temperature: 0.1,
      topP: 0.9,
    },
    'hermes': {
      displayName: '⚡ Hermes-3-Llama-3.1-70B',
      apiModelName: 'NousResearch/Hermes-3-Llama-3.1-70B',
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
    },
    'qwen': {
      displayName: '💻 Qwen2.5-Coder-32B-Instruct',
      apiModelName: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      maxTokens: 512,
      temperature: 0.1,
      topP: 0.9,
    },
  },
  image: {
    'flux': {
      displayName: '🎨 FLUX.1-dev',
      apiModelName: 'FLUX.1-dev',
    },
    'sd2': {
      displayName: '🖼️ SD2',
      apiModelName: 'SD2',
    },
  },
  audio: {
    'melo_tts': {
      displayName: '🔊 Melo TTS',
    },
  },
};

module.exports = models;