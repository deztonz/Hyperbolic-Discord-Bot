const { showCategorySelection } = require('../handlers/commandHandler');

module.exports = {
  data: {
    name: 'start',
    description: 'Initialize bot',
  },
  async execute(message) {
    // Call the showCategorySelection function to display the category selection menu
    await showCategorySelection(message);
  },
};