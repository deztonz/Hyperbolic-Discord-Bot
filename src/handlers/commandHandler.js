const { ActionRowBuilder, StringSelectMenuBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, AttachmentBuilder } = require('discord.js');
const { callTextModel, callImageModel, callAudioModel } = require('../utils/api');

const models = {
  text: {
    'meta_llama': {
      displayName: '🦙 Meta Llama 3.1 8B',
      apiModelName: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9
    },
    'deepseek': {
      displayName: '🔍 DeepSeek V3',
      apiModelName: 'deepseek-ai/DeepSeek-V3',
      maxTokens: 512,
      temperature: 0.1,
      topP: 0.9
    },
    'hermes': {
      displayName: '⚡ Hermes-3-Llama-3.1-70B',
      apiModelName: 'NousResearch/Hermes-3-Llama-3.1-70B',
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9
    },
    'qwen': {
      displayName: '💻 Qwen2.5-Coder-32B-Instruct',
      apiModelName: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      maxTokens: 512,
      temperature: 0.1,
      topP: 0.9
    }
  },
  image: {
    'flux': {
      displayName: '🎨 FLUX.1-dev',
      apiModelName: 'FLUX.1-dev'
    },
    'sd2': {
      displayName: '🖼️ SD2',
      apiModelName: 'SD2'
    }
  },
  audio: {
    'melo_tts': {
      displayName: '🔊 Melo TTS'
    }
  }
};

async function showCategorySelection(interaction) {
  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_category')
        .setPlaceholder('📂 Choose a category')
        .addOptions([
          { label: '📝 Text Models', value: 'text' },
          { label: '🖼️ Image Models', value: 'image' },
          { label: '🎧 Audio Models', value: 'audio' },
        ]),
    );

  await interaction.reply({ content: '*📂 Choose a category:*', components: [row] });
}

async function showModelSelection(interaction, category) {
  try {
    const modelList = models[category];
    const options = Object.entries(modelList).map(([key, model]) => ({
      label: model.displayName,
      value: key,
    }));

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select_model')
          .setPlaceholder(`🔧 Choose ${category} model`)
          .addOptions(options),
      );

    await interaction.update({ content: `*🔧 Choose ${category} model:*`, components: [row] });
  } catch (error) {
    console.error('Error in showModelSelection:', error);
    await interaction.reply({ content: 'There was an error processing your request.', flags: 64 });
  }
}

async function handleModelSelection(interaction, model) {
  try {
    const modal = new ModalBuilder()
      .setCustomId('prompt_modal')
      .setTitle('Enter your prompt')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('prompt_input')
            .setLabel('Prompt')
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    // Store the selected model in the interaction's customId for later use
    interaction.customId = `prompt_modal_${model}`;

    await interaction.showModal(modal);
  } catch (error) {
    console.error('Error in handleModelSelection:', error);
    await interaction.reply({ content: 'There was an error processing your request.', flags: 64 });
  }
}

async function handlePromptSubmission(interaction, selectedModel) {
  // Use the selectedModel in your prompt submission logic
  try {
    if (!selectedModel) {
      await interaction.reply({ content: 'No model selected. Please select a model first.' });
      return;
    }

    await interaction.deferReply();

    const prompt = interaction.fields.getTextInputValue('prompt_input');
    const model = selectedModel; // Extract the model from the customId
    const apiKey = process.env.HYPERBOLIC_API_KEY;

    console.log('Prompt received:', prompt);
    console.log('Model selected:', model);

    // Send a follow-up message indicating that the prompt was received
    

    let response;
    if (models.text[model]) {
      const { apiModelName, maxTokens, temperature, topP } = models.text[model];
      response = await callTextModel(apiKey, apiModelName, prompt, maxTokens, temperature, topP);
      await interaction.followUp({ content: `Response: ${response}` });
    } else if (models.image[model]) {
      const { apiModelName } = models.image[model];
      response = await callImageModel(apiKey, apiModelName, prompt);
      const attachment = new AttachmentBuilder(Buffer.from(response, 'base64'), { name: 'image.png' });
      await interaction.followUp({ files: [attachment] });
    } else if (models.audio[model]) {
      response = await callAudioModel(apiKey, prompt);
      await interaction.followUp({ content: `Response: ${response}` });
    }
    await interaction.followUp({ content: `Prompt received: ${prompt}\nModel selected: ${model}` });
  } catch (error) {
    console.error('Error in handlePromptSubmission:', error);
    console.error('Error details:', error.stack);
    await interaction.followUp({ content: 'There was an error processing your request.' });
  }
}

async function commandHandler(message) {
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = message.client.commands.get(commandName);

  if (!command) {
    return message.reply('Unknown command. Type !help for a list of commands.');
  }

  try {
    await command.execute(message);
  } catch (error) {
    console.error('Error in commandHandler:', error);
    message.reply('There was an error executing that command.');
  }
}

module.exports = {
  commandHandler,
  showCategorySelection,
  showModelSelection,
  handleModelSelection,
  handlePromptSubmission,
};