const TelegramApi = require('node-telegram-bot-api')
const { againOptions, gameOptions } = require('./options')

const token = '6534786130:AAEYECB8usZTH2xfzFGM_p_ntxxV5xZyTHo'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatID) => {
  await bot.sendMessage(chatID, `Сейчас я загадаю цифру от 0 до 9, а ты должен отгадать!`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatID] = randomNumber
  await bot.sendMessage(chatID, 'Отгадывай!', gameOptions)
}

const start = () => {
  bot.getMyCommands([
    { command: '/start', description: 'Начальное приветсвие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' },
  ])

  bot.on('message', async msg => {
    const text = msg.text
    const chatID = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(chatID, 'https://tlgrm.eu/_/stickers/c2b/583/c2b583cc-71f2-3f42-935b-9a9c7ac16fc5/1.webp')
      return bot.sendMessage(chatID, `Добро пожаловать на канал!`)
    }
    if (text === '/info') {
      return bot.sendMessage(chatID, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if (text === '/game') {
      return startGame(chatID)
    }
    return bot.sendMessage(chatID, 'Я тебя не понимаю, попробуй еще раз')
  })
  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatID = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatID)
    }
    if (data == chats[chatID]) {
      return bot.sendMessage(chatID, `Поздравляю, ты отгадал циру ${chats[chatID]}`, againOptions)
    } else {
      return bot.sendMessage(chatID, `К сожалению ты не угадал, бот загадал цифру ${chats[chatID]}`, againOptions)
    }
  })
}

start()