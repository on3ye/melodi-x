const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const folderPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(folderPath, file);
	const command = require(filePath);
	if ('data' in command && 'exec' in command) {
		commands.push(command.data.toJSON());
	}
	else {
		console.log(`The command at ${filePath} is missing a required "data" or "exec" property.`);
	}
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();