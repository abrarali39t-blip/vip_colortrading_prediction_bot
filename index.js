process.on("uncaughtException", () => {});
process.on("unhandledRejection", () => {});

const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.TOKEN;
const ADMIN_ID = 6076530076;
const CHANNEL_ID = "@tashanwin1112"; // change this

const bot = new TelegramBot(TOKEN, { polling: true });

let running = false;
let currentPeriod = 0;
let lastSize = "BIG";
let sendSecond = 55; // default

// =====================
function isAdmin(id) {
  return id === ADMIN_ID;
}

function nextSize(last) {
  if (Math.random() < 0.65) {
    return last === "BIG" ? "SMALL" : "BIG";
  }
  return last;
}

// =====================
function startExactTimer() {
  setInterval(() => {
    if (!running) return;

    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const sec = now.getSeconds();

    if (sec === sendSecond) {
      currentPeriod++;

      const predict = nextSize(lastSize);
      lastSize = predict;

      const msg = `
📊 PERIOD: ${currentPeriod}
🎯 PREDICTION: ${predict}

⚠️ Analysis based
`;

      bot.sendMessage(CHANNEL_ID, msg).catch(() => {});
    }
  }, 1000);
}

// =====================
// COMMANDS
// =====================

// /set 555 7 big green 44
bot.onText(/\/set (.+)/, (msg, match) => {
  if (!isAdmin(msg.from.id)) return;

  const d = match[1].split(" ");

  currentPeriod = parseInt(d[0]);
  lastSize = d[2].toUpperCase();
  sendSecond = parseInt(d[4]) || 55;

  bot.sendMessage(
    msg.chat.id,
    `✅ Data saved

Start Period: ${currentPeriod}
Start Size: ${lastSize}
Send Time: ${sendSecond} sec`
  );
});

// start
bot.onText(/\/startauto/, (msg) => {
  if (!isAdmin(msg.from.id)) return;

  if (running) return bot.sendMessage(msg.chat.id, "⚠️ Already running.");

  running = true;
  startExactTimer();

  bot.sendMessage(
    msg.chat.id,
    `🚀 Auto started
Prediction will send at :${sendSecond} second`
  );
});

// stop
bot.onText(/\/stop/, (msg) => {
  if (!isAdmin(msg.from.id)) return;

  running = false;
  bot.sendMessage(msg.chat.id, "⛔ Auto stopped.");
});

// check
bot.onText(/\/ping/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  bot.sendMessage(msg.chat.id, "✅ Bot running fine.");
});
