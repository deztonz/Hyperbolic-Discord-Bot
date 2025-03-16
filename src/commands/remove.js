const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Clear data'),
  async execute(interaction) {
    // Implement the logic to remove API key and selected model from the session
    await interaction.reply('🗑️ *Credentials removed*');
  },
};