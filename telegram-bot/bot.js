require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Ambil token & chat ID dari .env
const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

// Validasi
if (!token) {
  console.error("❌ BOT_TOKEN tidak ditemukan di file .env");
  process.exit(1);
}

// Buat bot dengan opsi polling stabil
const bot = new TelegramBot(token, {
  polling: {
    interval: 1500,     // jeda 1.5 detik antar polling
    autoStart: true,
    params: {
      timeout: 10,      // timeout tiap request polling
    },
  },
});

// ==================== Command sederhana ====================

// Tes koneksi bot
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, "🏓 Pong! Bot aktif & berjalan.");
});

// Kirim chat ID
bot.onText(/\/chatid/, (msg) => {
  bot.sendMessage(msg.chat.id, `Chat ID kamu: ${msg.chat.id}`);
});

// Uji kirim ke chat ID default dari .env
bot.onText(/\/sendhere/, () => {
  bot.sendMessage(chatId, "✅ Pesan dikirim ke chat default (dari .env)");
});

bot.on("message", (msg) => {
  console.log("📩 Pesan diterima dari chat ID:", msg.chat.id);
});


// ==================== Error Handling ====================
bot.on("polling_error", (error) => {
  console.warn("⚠️ Telegram polling error:", error.message);
});

bot.on("webhook_error", (error) => {
  console.error("🚨 Telegram webhook error:", error.message);
});

console.log("🤖 Telegram Bot aktif dan siap menerima perintah...");

module.exports = bot;
