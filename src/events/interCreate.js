const { Events } = require('discord.js');

const failReply = {
	content: 'There was an error while executing this command!',
	ephemeral: true,
};

module.exports = {
	name: Events.InteractionCreate,
	async exec(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching "${interaction.commandName}" was found.`);
			return;
		}

		try {
			await command.exec(interaction);
		}
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(failReply);
			}
			else {
				await interaction.reply(failReply);
			}
		}
	},
};