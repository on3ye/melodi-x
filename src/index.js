const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

client.commands = new Collection();
const folderPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(folderPath, file);
	const command = require(filePath);
	if ('data' in command && 'exec' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`The command at ${filePath} is missing a required "data" or "exec" property.`);
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.exec(...args));
	}
	else {
		client.on(event.name, (...args) => event.exec(...args));
	}
}

client.login(process.env.TOKEN);