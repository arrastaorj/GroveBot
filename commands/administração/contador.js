const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ChannelType,
    PermissionsBitField,
    PermissionFlagsBits,
} = require("discord.js");

const idioma = require("../../database/models/language")
const CounterModel = require("../../database/models/counter")

module.exports = {
    name: "contador",
    description: "configurar canal de contador na guilda",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "type",
            description: "tipo de canal contador",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "users", value: "USERS" },
                { name: "members", value: "MEMBERS" },
                { name: "bots", value: "BOTS" },
            ],
        },
        {
            name: "name",
            description: "nome do canal contador",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {


        let lang = await idioma.findOne({ guildId: interaction.guild.id })
        lang = lang ? require(`../../languages/${lang.language}.js`) : require('../../languages/pt.js')
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
            return interaction.reply({
                content: `${lang.alertNaoTemPermissão}`,
                ephemeral: true
            })


        const type = interaction.options.getString("type");
        const name = interaction.options.getString("name");




        if (!type || !["USERS", "MEMBERS", "BOTS"].includes(type.toUpperCase())) {
            return interaction.reply({
                content: `Argumentos incorretos passados! Tipos de contador: \`usuários/membros/bots\``,
                ephemeral: true
            })
        }

        if (!name) {
            return interaction.reply({
                content: `Uso incorreto! Você não forneceu o nome`,
                ephemeral: true
            })
        }


        let channelName = name;

        const members = await interaction.guild.members.fetch();
        const stats = [members.size, members.filter(member => member.user.bot).size, members.filter(member => !member.user.bot).size];

        const existingChannel = interaction.guild.channels.cache.find(channel => channel.name === channelName);

        if (existingChannel) {

            return interaction.reply({
                content: `Um canal com esse nome já existe. Escolha um nome diferente`,
                ephemeral: true
            })
        }


        const existingTypeChannel = interaction.guild.channels.cache.find(channel => {
            return (
                (type === "USERS" && channel.name.endsWith(" : " + stats[0])) ||
                (type === "MEMBERS" && channel.name.endsWith(" : " + stats[2])) ||
                (type === "BOTS" && channel.name.endsWith(" : " + stats[1]))
            )
        })
        if (existingTypeChannel) {


            return interaction.reply({
                content: `Um canal com esse tipo já existe. Escolha um tipo diferente`,
                ephemeral: true
            })
        }

        let counter = await CounterModel.findOne({
            guildId: interaction.guild.id
        })




        if (type === "USERS") {

            channelName += ` : ${stats[0]}`

            if (!counter) {
                counter = await CounterModel.create({
                    guildId: interaction.guild.id,
                    users: `${stats[0]}`,
                })

            } else {

                counter = await CounterModel.findOneAndUpdate({
                    guildId: interaction.guild.id,
                    users: `${stats[0]}`,

                })
            }


        }

        else if (type === "MEMBERS") {

            channelName += ` : ${stats[2]}`

            if (!counter) {
                counter = await CounterModel.create({
                    guildId: interaction.guild.id,
                    members: `${stats[2]}`,
                })
            } else {

                counter = await CounterModel.findOneAndUpdate({
                    guildId: interaction.guild.id,
                    members: `${stats[2]}`,
                })
            }

        }

        else if (type === "BOTS") {

            channelName += ` : ${stats[1]}`

            if (!counter) {
                counter = await CounterModel.create({
                    guildId: interaction.guild.id,
                    bots: `${stats[1]}`,
                })
            } else {

                counter = await CounterModel.findOneAndUpdate({
                    guildId: interaction.guild.id,
                    bots: `${stats[1]}`,
                })
            }
        }



        const channelCreat = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.Connect],
                },
                {
                    id: interaction.guild.members.me.roles.highest,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Connect],
                },
            ],
        })



        if (type === "USERS") {
            counter = await CounterModel.findOneAndUpdate({
                guildId: interaction.guild.id,
                userChannel: channelCreat.id,
            })
        }

        if (type === "MEMBERS") {
            counter = await CounterModel.findOneAndUpdate({
                guildId: interaction.guild.id,
                memberChannel: channelCreat.id,
            })
        }

        if (type === "BOTS") {
            counter = await CounterModel.findOneAndUpdate({
                guildId: interaction.guild.id,
                botChannel: channelCreat.id,
            })
        }




        return interaction.reply({
            content: `Configuração salva! Canal de contador criado`,
            ephemeral: true
        })

    }
}



