const {
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
    ApplicationCommandOptionType,
    ChannelType,
} = require('discord.js');
const axios = require('axios');
const Stremer = require('../../database/models/stremer'); // Importando o modelo do MongoDB
const idioma = require("../../database/models/language");

const twitchClientId = 'vmmycaqpm5slqk4925ig7wt2muk6sd';
const twitchClientSecret = 'gepsd2yh3q1d8ogt4i3i6v0evxysjl';

// Variável para armazenar o access token da Twitch
let twitchAccessToken = '';

// Função para obter o token de acesso da Twitch
function getTwitchAccessToken() {
    return axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
            client_id: twitchClientId,
            client_secret: twitchClientSecret,
            grant_type: 'client_credentials'
        }
    })
        .then(response => {
            twitchAccessToken = response.data.access_token;
        })
        .catch(error => {
            console.error('Erro ao obter o token de acesso da Twitch:', error.response.data);
        });
}

// Função para obter informações do streamer
function getStreamerInfo(username) {
    return axios.get('https://api.twitch.tv/helix/users', {
        headers: {
            'Client-ID': twitchClientId,
            'Authorization': `Bearer ${twitchAccessToken}`
        },
        params: {
            login: username
        }
    })
        .then(response => {
            return response.data.data[0]; // Retorna os dados do streamer
        })
        .catch(error => {
            console.error('Erro ao obter as informações do streamer:', error.response.data);
            return null;
        });
}

module.exports = {
    name: "cadastrar",
    description: "Configure a notificação de lives de um streamer.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'stremer',
            description: 'Configure o canal de notificação, o nome do streamer e o membro do Discord.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "canal",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    description: "Selecione o canal onde será enviada a notificação das lives.",
                    required: true
                },
                {
                    name: "usuario",
                    type: ApplicationCommandOptionType.String,
                    description: "Informe o nome do streamer na Twitch.",
                    required: true
                },
                {
                    name: "membro",
                    type: ApplicationCommandOptionType.User,
                    description: "Selecione o membro do Discord que faz live.",
                    required: true 
                },
                {
                    name: "cargo",
                    type: ApplicationCommandOptionType.Role,
                    description: "Selecione o cargo que será atribuído quando o membro estiver ao vivo.",
                    required: false
                },
            ],
        },
    ],

    async run(client, interaction) {
        let lang = await idioma.findOne({
            guildId: interaction.guild.id,
        });
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: lang.alertNaoTemPermissão,
                ephemeral: true
            });
        }

        const botMember = interaction.guild.members.cache.get(client.user.id);
        if (!botMember.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: lang.alertPermissãoBot,
                ephemeral: true
            });
        }

        const canal = interaction.options.getChannel('canal')
        const usuario = interaction.options.getString('usuario').toLowerCase()
        const membro = interaction.options.getUser('membro')
        const cargoEmLive = interaction.options.getRole('cargo')



        // Obtenha o token de acesso da Twitch (se ainda não estiver disponível)
        if (!twitchAccessToken) {
            await getTwitchAccessToken();
        }

        // Verifica se o usuário é válido na Twitch
        const streamerInfo = await getStreamerInfo(usuario);
        if (!streamerInfo) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Erro')
                        .setDescription(`O nome de usuário **${usuario}** não é válido na Twitch. Por favor, verifique e tente novamente.`)
                ],
                ephemeral: true
            });
        }

        try {
            // Verifica se já existe um cadastro para esse streamer no servidor
            let stremerConfig = await Stremer.findOne({ guildId: interaction.guild.id, stremer: usuario });

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(stremerConfig ? 'Configuração Atualizada' : 'Streamer Cadastrado')
                .addFields(
                    { name: 'Streamer na Twitch', value: `**${usuario}**`, inline: true },
                    { name: 'Canal de Notificação', value: `<#${canal.id}>`, inline: true },
                    { name: 'Membro do Discord', value: `<@${membro.id}>`, inline: true }
                );


                if (cargoEmLive) {
                    embed.addFields({ name: 'Cargo "EM LIVE"', value: `<@&${cargoEmLive.id}>`, inline: true });
                }

                

            if (stremerConfig) {
                // Atualiza a configuração existente
                stremerConfig.canal1 = canal.id;
                stremerConfig.discordMemberId = membro.id; // Atualiza o ID do membro
                if (cargoEmLive) stremerConfig.cargoEmLive = cargoEmLive.id;
                await stremerConfig.save();
                embed.setDescription(`Configuração atualizada para o streamer **${usuario}**.`);
            } else {
                // Cria uma nova configuração
                stremerConfig = new Stremer({
                    guildId: interaction.guild.id,
                    stremer: usuario,
                    canal1: canal.id,
                    discordMemberId: membro.id, // Salva o ID do membro
                    cargoEmLive: cargoEmLive ? cargoEmLive.id : null
                });
                await stremerConfig.save();
                embed.setDescription(`Streamer **${usuario}** cadastrado com sucesso!`);
            }

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        } catch (error) {
            console.error('Erro ao salvar a configuração do streamer:', error);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Erro')
                        .setDescription(`Ocorreu um erro ao tentar cadastrar o streamer **${usuario}**.`)
                ],
                ephemeral: true
            });
        }
    }
};
