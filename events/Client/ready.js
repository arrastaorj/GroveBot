const client = require('../../index')
const discord = require("discord.js")
const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')
require('colors')


client.on('ready', async () => {

  client.riffy.init(client.user.id)

  const statuses = [
    { name: '✏️ Personalize com /embed criar', type: discord.ActivityType.Custom },
    { name: '🚫 proteger com /antilink', type: discord.ActivityType.Custom },
    { name: '🎭 gerencie com /cargos', type: discord.ActivityType.Custom },
    { name: '🛡️ moderação com /automod', type: discord.ActivityType.Custom }
  ]

  let index = 0

  setInterval(() => {
    client.user.setPresence({
      activities: [statuses[index]],
      status: 'online',
    })

    index = (index + 1) % statuses.length

  }, 60000)

  client.user.setStatus('online')


  // Exemplo: Verificar a cada 24 horas (86400000 ms)
  setInterval(() => {
    fetchLatestPatch(client)
  }, 86400000) // 86400000 24 horas


  console.log("[Bot-Status]".bgBlue, `> Estou online como: ${client.user.username}`.blue)
})

// Função para ler a versão mais recente do arquivo JSON
function readLatestPatchVersion() {
  try {
    const data = fs.readFileSync('latestPatch.json', 'utf8')
    const json = JSON.parse(data)
    return json.latestPatchVersion
  } catch (error) {
    console.error('Erro ao ler o arquivo latestPatch.json:', error)
    return null
  }
}

// Função para salvar a versão mais recente no arquivo JSON
function saveLatestPatchVersion(version) {
  try {
    fs.writeFileSync('latestPatch.json', JSON.stringify({ latestPatchVersion: version }, null, 2), 'utf8')
  } catch (error) {
    console.error('Erro ao escrever no arquivo latestPatch.json:', error)
  }
}


async function fetchLatestPatch(client) {
  try {
    const patchNotesUrl = 'https://www.leagueoflegends.com/pt-br/news/tags/patch-notes/'

    // Fazendo a requisição HTTP
    const response = await axios.get(patchNotesUrl)

    // Carregando o conteúdo da página no cheerio
    const $ = cheerio.load(response.data)

    // Obtendo o link da atualização mais recente
    const patchLink = $('a:contains("Notas da Atualização")').first().attr('href')
    const fullPatchUrl = `https://www.leagueoflegends.com${patchLink}`

    // Segunda requisição: acessar a página do patch
    const patchResponse = await axios.get(fullPatchUrl)
    const patchPage = cheerio.load(patchResponse.data)

    // Extrair o link da imagem dentro da classe "content-border"
    const imageLink = patchPage('.content-border a').attr('href')

    // Buscando o conteúdo do script que contém "props"
    const scriptTagContent = $('script').filter((i, el) => $(el).html().includes('"props":')).html()

    if (!scriptTagContent) {
      console.error('Erro: script contendo "props" não encontrado.')
      return
    }

    // Extraindo o conteúdo JSON do script
    const jsonData = JSON.parse(scriptTagContent.match(/{.*}/)[0])

    // Acessando o primeiro item de articleCardGrid
    const articleCardGrid = jsonData.props.pageProps.page.blades.find(blade => blade.type === 'articleCardGrid')

    if (articleCardGrid && articleCardGrid.items.length > 0) {
      const firstItem = articleCardGrid.items[0]
      const title = firstItem.title
      const publishedAt = firstItem.publishedAt
      const articleUrl = firstItem.action.payload.url

      // Convertendo o publishedAt para uma data legível
      const formattedDate = new Date(publishedAt).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      // Obtenha a versão da atualização a partir do título ou URL
      const currentPatchVersion = title || articleUrl

      // Carregar a versão mais recente armazenada
      const latestPatchVersion = readLatestPatchVersion()

      if (currentPatchVersion !== latestPatchVersion) {
        // Atualiza a versão mais recente armazenada
        saveLatestPatchVersion(currentPatchVersion)

        // Cria o embed para enviar a atualização no canal
        const embed = new discord.EmbedBuilder()
          .setColor('#0099ff')
          .setTitle(title)
          .setImage(imageLink)
          .setURL(`https://www.leagueoflegends.com${articleUrl}`)
          .setDescription(`Notas da atualização publicadas em ${formattedDate}`)
          .setTimestamp()
          .setFooter({ text: 'League of Legends', iconURL: firstItem.product.media.url })

        // Obtém o canal onde as notas de atualização serão enviadas (substitua 'canalID' pelo ID correto)
        const channel = await client.channels.fetch('1279425457988567134')
        if (channel) {
          channel.send({ embeds: [embed] })
        } else {
          console.error('Canal não encontrado.')
        }
      } else {
        console.log('Nenhuma nova atualização encontrada.')
      }

    } else {
      console.error('Não foi possível encontrar as notas de atualização.')
    }

  } catch (error) {
    console.error(`Erro ao buscar os dados: ${error.message}`)
  }
}