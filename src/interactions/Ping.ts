import { SlashCommandBuilder } from '@discordjs/builders';

const PingInteraction = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Checks bots heartbeat.');

export default PingInteraction;