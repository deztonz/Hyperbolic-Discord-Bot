const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: {
    name: 'help',
    description: 'Show help information',
  },
  async execute(message) {
    await message.reply(
      '📚 *Commands:*\n' +
      '*!start* - Initialize bot\n' +
      '*!switch* - Change model\n' +
      '*!remove* - Clear data\n' +
      '*!help* - Show this help'
    );
  },
};