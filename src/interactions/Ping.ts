import { SlashCommandBuilder } from '@discordjs/builders';

export const PingInteraction = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Checks bots heartbeat.');