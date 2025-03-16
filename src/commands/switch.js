const { SlashCommandBuilder } = require('@discordjs/builders');
const { showCategorySelection } = require('../handlers/commandHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('switch')
    .setDescription('Change model'),
  async execute(interaction) {
    await showCategorySelection(interaction);
  },
};