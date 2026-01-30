const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const TOKEN = process.env.TOKEN;
const ADMIN_ID = 6076530076;

const bot = new TelegramBot(TOKEN, { polling: true });

// ================= SERVER
const app = express();
app.get("/", (req, res) => res.send("☠️ DARK AI VIP ONLINE"));
app.listen(process.env.PORT || 3000);

// ================= DATA
let USERS = {};
let ALL_USERS = [];

// ================= DAILY ACTIVE
let DAILY_ACTIVE = new Set();
let CURRENT_DATE = new Date().toDateString();

// ================= FUNCTIONS
function trackDailyUser(chatId) {
  const today = new Date().toDateString();
  if (today !== CURRENT_DATE) {
    DAILY_ACTIVE.clear();
    CURRENT_DATE = today;
  }
  DAILY_ACTIVE.add(chatId);
}

// ================= AI TYPING ANIMATION
async function aiTyping(chatId, text, delay = 25) {
  await bot.sendChatAction(chatId, "typing");

  let msg = "";
  const sent = await bot.sendMessage(chatId, "‎");

  for (let ch of text) {
    msg += ch;
    await bot.editMessageText(msg, {
      chat_id: chatId,
      message_id: sent.message_id,
      parse_mode: "Markdown"
    });
    await new Promise(r => setTimeout(r, delay));
  }
}

// ================= START
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (!ALL_USERS.includes(chatId)) ALL_USERS.push(chatId);

  USERS[chatId] = { step: 1 };

  bot.sendMessage(
    chatId,
`☠️ *DARK AI VIP SYSTEM*

━━━━━━━━━━━━━━
🤖 Neural Prediction Engine
📊 Deep Pattern Scan
⚡ Ultra Premium Mode
━━━━━━━━━━━━━━

🔢 *Enter last 3 digits*
Example: \`555\`

⚠️ VIP Interface Activated`,
    { parse_mode: "Markdown" }
  );
});

// ================= VIP COMMAND
bot.onText(/\/vip/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`💎 *DARK AI VIP STATUS*

━━━━━━━━━━━━━━
👤 User: VIP
🧠 Engine: Neural Pro
📊 Accuracy: 90–99%
⚡ Speed: Ultra
🔐 Security: Encrypted
━━━━━━━━━━━━━━

🔥 Premium AI Activated`,
    { parse_mode: "Markdown" }
  );
});

// ================= ADMIN STATS
bot.onText(/\/stats/, (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;

  bot.sendMessage(
    msg.chat.id,
`📊 *ADMIN PANEL*

👥 Total Users: ${ALL_USERS.length}
🔥 Today Active: ${DAILY_ACTIVE.size}

☠️ System: ONLINE`,
    { parse_mode: "Markdown" }
  );
});

// ================= BROADCAST TEXT
bot.onText(/\/broadcast([\s\S]+)/, async (msg, match) => {
  if (msg.chat.id !== ADMIN_ID) return;

  const message = match[1].trim();
  if (!message) return bot.sendMessage(msg.chat.id, "❌ Write message");

  let success = 0, failed = 0;

  for (const id of ALL_USERS) {
    try {
      await bot.sendMessage(id, `📢 *VIP ANNOUNCEMENT*\n\n${message}`, {
        parse_mode: "Markdown"
      });
      success++;
    } catch {
      failed++;
    }
  }

  bot.sendMessage(msg.chat.id, `✅ Broadcast Done\nSent: ${success}\nFailed: ${failed}`);
});

// ================= IMAGE BROADCAST
bot.on("photo", async (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;
  if (!msg.caption || !msg.caption.startsWith("/broadcast")) return;

  const text = msg.caption.replace("/broadcast", "").trim();
  const photoId = msg.photo[msg.photo.length - 1].file_id;

  let success = 0, failed = 0;

  for (const id of ALL_USERS) {
    try {
      await bot.sendPhoto(id, photoId, {
        caption: `☠️ *DARK AI VIP ALERT*\n\n${text}`,
        parse_mode: "Markdown"
      });
      success++;
    } catch {
      failed++;
    }
  }

  bot.sendMessage(msg.chat.id, `🖼 Image Broadcast Done\nSent: ${success}\nFailed: ${failed}`);
});

// ================= AI FLOW
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  trackDailyUser(chatId);

  if (!USERS[chatId]) return;
  if (!text || text.startsWith("/")) return;

  const user = USERS[chatId];

  if (user.step === 1) {
    user.period = text;
    user.step = 2;
    return bot.sendMessage(chatId, "🔢 *Enter Number (0–9)*", { parse_mode: "Markdown" });
  }

  if (user.step === 2) {
    user.number = text;
    user.step = 3;
    return bot.sendMessage(chatId, "📊 *Big or Small*", { parse_mode: "Markdown" });
  }

  if (user.step === 3) {
    user.size = text;
    user.step = 4;
    return bot.sendMessage(chatId, "🎨 *Color (Red / Green / Violet)*", { parse_mode: "Markdown" });
  }

  if (user.step === 4) {
    user.color = text;

    await bot.sendMessage(
      chatId,
`🤖 *AI PROCESSING*

🧠 Neural Scan...
📡 Pattern Matching...
⚙️ Prediction Engine Loading...

⏳ Please wait...`,
      { parse_mode: "Markdown" }
    );

    setTimeout(async () => {
      const next = parseInt(user.period) + 1;
      const size = Math.random() > 0.5 ? "BIG 🔥" : "SMALL ❄️";
      const colors = ["RED 🔴", "GREEN 🟢", "VIOLET 🟣"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const conf = Math.floor(80 + Math.random() * 18);

      await aiTyping(
        chatId,
`☠️ *DARK AI VIP RESULT*

━━━━━━━━━━━━━━
📌 Period: *${next}*
🔥 Prediction: *${size}*
🎨 Color: *${color}*
🎯 Accuracy: *${conf}%*
━━━━━━━━━━━━━━

💎 Neural Engine Active
⚠️ Play Responsibly`,
        22
      );

      USERS[chatId] = { step: 1 };
    }, 2000);
  }
});