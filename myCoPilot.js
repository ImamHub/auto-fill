require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bot = require("./telegram-bot/bot"); // Import bot
const app = express();

const port = process.env.PORT || 3000;
const db = process.env.DB || "mongodb://127.0.0.1:27017/auto-fill-local";
const chatId = process.env.CHAT_ID;

// ========================================
// 🧩 Database Configuration
// ========================================
mongoose.set("strictQuery", false);

(async function connectDB() {
  try {
    await mongoose.connect(db);
    console.log("✅ Connected to MongoDB");

    // Kirim pesan Telegram jika DB & server aktif
    bot.sendMessage(
      chatId,
      `🚀 Server *auto-fill-radio-datek* sudah aktif di port ${port}\n📡 Database: *Connected*`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    console.error("❌ Gagal konek MongoDB:", err.message);
    bot.sendMessage(
      chatId,
      `⚠️ Gagal konek MongoDB:\n\`${err.message}\``,
      { parse_mode: "Markdown" }
    );
  }
})();

// ========================================
// 🧠 Routing
// ========================================
app.get("/", (req, res) => {
  res.send("<h1>Server auto-fill-radio-datek aktif 🚀</h1>");
});

// Handle route yang tidak ditemukan
app.get("*", (req, res) => {
  res.status(404).send("<h1>404 | Page Not Found</h1>");
});

// ========================================
// 🖥️ Jalankan server
// ========================================
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
