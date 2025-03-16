require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { commandHandler, showModelSelection, handleModelSelection, handlePromptSubmission } = require('./handlers/commandHandler');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return; // Ignore messages from bots
  await commandHandler(message);
});

// Map to store selected models for each user
const userSelectedModels = new Map();

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isSelectMenu()) {
      if (interaction.customId === 'select_category') {
        const category = interaction.values[0];
        await showModelSelection(interaction, category);
      } else if (interaction.customId === 'select_model') {
        const model = interaction.values[0];
        userSelectedModels.set(interaction.user.id, model); // Store selected model
        await handleModelSelection(interaction, model);
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === 'prompt_modal') {
        const selectedModel = userSelectedModels.get(interaction.user.id); // Retrieve selected model
        await handlePromptSubmission(interaction, selectedModel);
      }
    }
  } catch (error) {
    console.error('Error in interactionCreate:', error);
    await interaction.reply({ content: 'There was an error processing your request.', flags: 64 });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);