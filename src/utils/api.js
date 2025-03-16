const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.hyperbolic.xyz/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

async function callTextModel(apiKey, modelName, input, maxTokens, temperature, topP) {
  const url = '/chat/completions';
  const data = {
    messages: [{ role: 'user', content: input }],
    model: modelName,
    max_tokens: maxTokens,
    temperature: temperature,
    top_p: topP,
  };
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  console.log('Calling text model with data:', data);

  try {
    const response = await apiClient.post(url, data, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling text model:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error calling text model');
  }
}

async function callImageModel(apiKey, modelName, prompt) {
  
  const url = '/image/generation';
  const data = {
    model_name: modelName,
    prompt: prompt,
    steps: 30,
    cfg_scale: 5,
    enable_refiner: false,
    height: 1024,
    width: 1024,
    backend: 'auto',
  };
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  console.log('Calling image model with data:', data);

  try {
    const response = await apiClient.post(url, data, { headers });
    return response.data.images[0].image;
  } catch (error) {
    console.error('Error calling image model:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error calling image model');
  }
}

async function callAudioModel(apiKey, input) {
  const url = '/audio/generation';
  const data = { text: input, speed: 1 };
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  console.log('Calling audio model with data:', data);

  try {
    const response = await apiClient.post(url, data, { headers });
    return response.data.audio;
  } catch (error) {
    console.error('Error calling audio model:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error calling audio model');
  }
}

module.exports = {
  callTextModel,
  callImageModel,
  callAudioModel,
};