const client = require("../../index");
const axios = require('axios');
const { EmbedBuilder } = require("discord.js");
const Stremer = require('../../database/models/stremer'); // Importando o modelo do MongoDB

// Credenciais da Twitch
const twitchClientId = 'vmmycaqpm5slqk4925ig7wt2muk6sd';
const twitchClientSecret = 'gepsd2yh3q1d8ogt4i3i6v0evxysjl';

// Variável para armazenar o access token da Twitch
let twitchAccessToken = '';

// Variável para rastrear notificações enviadas por servidor e streamer
const notifications = {};

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
            console.log('Token de acesso da Twitch obtido com sucesso');
        })
        .catch(error => {
            console.error('Erro ao obter o token de acesso da Twitch:', error.response.data);
        });
}

// Função para obter informações do streamer
function getStreamerInfo(userId) {
    return axios.get(`https://api.twitch.tv/helix/users`, {
        headers: {
            'Client-ID': twitchClientId,
            'Authorization': `Bearer ${twitchAccessToken}`
        },
        params: {
            id: userId
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

// Função para obter informações do jogo
function getGameInfo(gameId) {
    return axios.get(`https://api.twitch.tv/helix/games`, {
        headers: {
            'Client-ID': twitchClientId,
            'Authorization': `Bearer ${twitchAccessToken}`
        },
        params: {
            id: gameId
        }
    })
        .then(response => {
            return response.data.data[0]; // Retorna os dados do jogo
        })
        .catch(error => {
            console.error('Erro ao obter as informações do jogo:', error.response.data);
            return null;
        });
}

// Função para verificar se o streamer está ao vivo
function checkIfStreamerIsLive(streamerUsername, guildId, notificationChannelId) {
    return axios.get(`https://api.twitch.tv/helix/streams`, {
        headers: {
            'Client-ID': twitchClientId,
            'Authorization': `Bearer ${twitchAccessToken}`
        },
        params: {
            user_login: streamerUsername
        }
    })
        .then(response => {
            const streamData = response.data.data[0];

            if (streamData && streamData.type === 'live') {
                // Verifica se já foi notificado neste servidor
                if (!notifications[guildId]?.includes(streamerUsername)) {
                    console.log(`${streamerUsername} está ao vivo no servidor ${guildId}! 🎥`);

                    // Obtendo informações adicionais do streamer e do jogo
                    Promise.all([getStreamerInfo(streamData.user_id), getGameInfo(streamData.game_id)])
                        .then(([streamerInfo, gameInfo]) => {
                            if (streamerInfo && gameInfo) {
                                const profileImageUrl = streamerInfo.profile_image_url;
                                const gameImageUrl = gameInfo.box_art_url.replace('{width}x{height}', '1280x1080'); // Ajustar tamanho da imagem do jogo

                                const playList = new EmbedBuilder()
                                    .setColor('#9146FF')
                                    .setTitle(`${streamerUsername} está ao vivo! 🎥`)
                                    .setURL(`https://www.twitch.tv/${streamerUsername}`)
                                    .setThumbnail(profileImageUrl) // Imagem do perfil do streamer
                                    .addFields(
                                        { name: 'Título da Live', value: streamData.title || 'Título ainda não disponível', inline: true },
                                    )
                                    .setImage(gameImageUrl) // Imagem do jogo
                                    .setTimestamp()
                                    .setFooter({ text: 'Assista na Twitch', iconURL: `${profileImageUrl}` });

                                sendNotification(notificationChannelId, { embeds: [playList] });

                                // Adiciona o streamer à lista de notificados para este servidor
                                if (!notifications[guildId]) {
                                    notifications[guildId] = [];
                                }
                                notifications[guildId].push(streamerUsername);
                            }
                        });
                }
            } else {
                console.log(`${streamerUsername} não está ao vivo no servidor ${guildId}.`);
                // Remove o streamer da lista de notificados quando ele sair do ar
                if (notifications[guildId]) {
                    notifications[guildId] = notifications[guildId].filter(username => username !== streamerUsername);
                }
            }
        })
        .catch(error => {
            console.error('Erro ao verificar se o streamer está ao vivo:', error.response.data);
        });
}

// Função para enviar a notificação para o canal especificado
function sendNotification(channelId, message) {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
        channel.send(message)
            .then(() => console.log('Notificação enviada para o canal.'))
            .catch(console.error);
    } else {
        console.error('Canal de notificação não encontrado.');
    }
}

// Função principal para configurar o intervalo de verificação
function startLiveCheck() {
    getTwitchAccessToken().then(() => {
        setInterval(async () => {
            // Obtendo todos os streamers e canais cadastrados no banco de dados
            const streamers = await Stremer.find();

            streamers.forEach((stremer) => {
                checkIfStreamerIsLive(stremer.stremer, stremer.guildId, stremer.canal1);
            });
        }, 120000); // 10000ms = 10 segundos
    });
}

// Evento para quando o bot estiver pronto
client.once('ready', () => {
    startLiveCheck();
});
