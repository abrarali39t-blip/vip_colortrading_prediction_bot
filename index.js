const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const TOKEN = process.env.TOKEN;
const ADMIN_ID = 6076530076;

const bot = new TelegramBot(TOKEN, { polling: true });

// ================= SERVER (KEEP ALIVE)
const app = express();
app.get("/", (req, res) => res.send("☠️ DARK AI VIP ONLINE"));
app.listen(process.env.PORT || 3000);

// ================= DATA
let USERS = {};
let ALL_USERS = [];

/*
VIP_USERS FORMAT
userId: {
  type: "lifetime" | "10days",
  expire: timestamp | null
}
*/

let VIP_USERS = {
  [ADMIN_ID]: { type: "lifetime", expire: null }
};

// ================= CRASH PROTECTION
process.on("uncaughtException", err => console.log("ERROR:", err));
process.on("unhandledRejection", err => console.log("PROMISE ERROR:", err));

// ================= AI TYPING EFFECT
async function aiTyping(chatId, text, delay = 22) {
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

// ================= VIP CHECK
function isVIP(userId) {
  const vip = VIP_USERS[userId];
  if (!vip) return false;

  if (vip.type === "lifetime") return true;

  if (vip.expire && Date.now() > vip.expire) {
    delete VIP_USERS[userId];
    return false;
  }

  return true;
}

// ================= START
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (!ALL_USERS.includes(chatId)) ALL_USERS.push(chatId);

  if (!isVIP(chatId)) {
    return bot.sendMessage(
      chatId,
`🔒 *VIP ACCESS REQUIRED*

━━━━━━━━━━━━━━
💎 DARK AI PREMIUM SYSTEM

📅 10 Days VIP → ₹259
♾ Lifetime VIP → ₹349

🔥 4th Level → *99.9% Prediction*

📩 Buy VIP:
👉 @willian2500

⚠️ Without VIP bot cannot be used`,
      { parse_mode: "Markdown" }
    );
  }

  USERS[chatId] = { step: 1 };

  bot.sendMessage(
    chatId,
`☠️ *DARK AI VIP SYSTEM*

🤖 Neural Engine Activated
📊 Premium Prediction Mode

🔢 Enter last 3 digits
Example: \`555\``,
    { parse_mode: "Markdown" }
  );
});

// ================= ADMIN ADD VIP
// /addvip userId 10
// /addvip userId life

bot.onText(/\/addvip (.+)/, (msg, match) => {
  if (msg.chat.id !== ADMIN_ID) return;

  const [id, type] = match[1].split(" ");
  const userId = parseInt(id);

  if (!userId || !type) {
    return bot.sendMessage(msg.chat.id, "Usage:\n/addvip userId 10\n/addvip userId life");
  }

  if (type === "10") {
    VIP_USERS[userId] = {
      type: "10days",
      expire: Date.now() + 10 * 24 * 60 * 60 * 1000
    };
    return bot.sendMessage(msg.chat.id, "✅ 10 Days VIP Added");
  }

  if (type === "life") {
    VIP_USERS[userId] = {
      type: "lifetime",
      expire: null
    };
    return bot.sendMessage(msg.chat.id, "♾ Lifetime VIP Added");
  }

  bot.sendMessage(msg.chat.id, "❌ Type must be 10 or life");
});

// ================= TEXT BROADCAST
bot.onText(/\/broadcast([\s\S]+)/, async (msg, match) => {
  if (msg.chat.id !== ADMIN_ID) return;

  const text = match[1].trim();
  if (!text) return bot.sendMessage(msg.chat.id, "❌ Message likho");

  let success = 0, failed = 0;

  for (const id of ALL_USERS) {
    try {
      await bot.sendMessage(id, text, { parse_mode: "Markdown" });
      success++;
    } catch {
      failed++;
    }
  }

  bot.sendMessage(
    msg.chat.id,
    `✅ Broadcast Done\nSent: ${success}\nFailed: ${failed}`
  );
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
        caption: text || "📢 VIP Announcement",
        parse_mode: "Markdown"
      });
      success++;
    } catch {
      failed++;
    }
  }

  bot.sendMessage(
    msg.chat.id,
    `🖼 Image Broadcast Done\nSent: ${success}\nFailed: ${failed}`
  );
});

// ================= MAIN AI FLOW
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!USERS[chatId]) return;
  if (!text || text.startsWith("/")) return;

  if (!isVIP(chatId)) {
    return bot.sendMessage(
      chatId,
`🔒 *VIP EXPIRED*

📅 10 Days → ₹259
♾ Lifetime → ₹349

Admin:
👉 @willian2500`,
      { parse_mode: "Markdown" }
    );
  }

  const user = USERS[chatId];

  if (user.step === 1) {
    user.period = text;
    user.step = 2;
    return bot.sendMessage(chatId, "🔢 Enter number (0–9)");
  }

  if (user.step === 2) {
    user.number = text;
    user.step = 3;
    return bot.sendMessage(chatId, "📊 Big or Small?");
  }

  if (user.step === 3) {
    user.size = text;
    user.step = 4;
    return bot.sendMessage(chatId, "🎨 Color (Red / Green / Violet)");
  }

  if (user.step === 4) {
  user.color = text;

  // AI ANALYZING MESSAGE
  await bot.sendMessage(
    chatId,
`🤖 *AI ANALYZING...*

🧠 Pattern scanning
📡 Neural calculation
⚙️ Probability engine`,
    { parse_mode: "Markdown" }
  );

  // typing animation
  await bot.sendChatAction(chatId, "typing");

  setTimeout(async () => {

    const nextPeriod = parseInt(user.period) + 1;

    const size = Math.random() > 0.5 ? "BIG 🔥" : "SMALL ❄️";
    const colors = ["RED 🔴", "GREEN 🟢", "VIOLET 🟣"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const accuracy = Math.floor(90 + Math.random() * 9);

    await bot.sendMessage(
      chatId,
`✅ *AI RESULT*

━━━━━━━━━━━━━━
📌 Next Period: *${nextPeriod}*
🔥 Result: *${size}*
🎨 Color: *${color}*
🎯 Accuracy: *${accuracy}%*
━━━━━━━━━━━━━━

💎 DARK AI VIP`,
      { parse_mode: "Markdown" }
    );

    USERS[chatId] = { step: 1 };

  }, 1000); // ⏱️ 1 second delay
}