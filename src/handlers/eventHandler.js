const { Client, GatewayIntentBits } = require('discord.js');
const commandHandler = require('./commandHandler');

const eventHandler = (client) => {
  client.on('ready', () => {
    console.log(`🤖 Bot running as ${client.user.tag}`);
  });

  client.on('messageCreate', (message) => {
    if (!message.author.bot) {
      commandHandler(message);
    }
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    commandHandler(interaction);
  });
};

module.exports = eventHandler;