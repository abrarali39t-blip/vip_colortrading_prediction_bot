const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.TOKEN;
const ADMIN_ID = 6076530076;
const CHANNEL_ID = "@yourchannelusername";

const bot = new TelegramBot(TOKEN, { polling: true });

let running = false;
let currentPeriod = 0;
let lastSize = "BIG";

// admin check
function isAdmin(id) {
  return id === ADMIN_ID;
}

function nextSize(last) {
  if (Math.random() < 0.65) {
    return last === "BIG" ? "SMALL" : "BIG";
  }
  return last;
}

// exact time sender
function startExactTimer() {
  setInterval(() => {
    const now = new Date();
    const sec = now.getSeconds();

    if (sec === 55 && running) {
      currentPeriod++;

      const predict = nextSize(lastSize);
      lastSize = predict;

      bot.sendMessage(
        CHANNEL_ID,
        `📊 PERIOD: ${currentPeriod}
🎯 PREDICTION: ${predict}

⚠️ Analysis based`
      );
    }
  }, 1000);
}

// SET DATA (ADMIN ONLY)
bot.onText(/\/set (.+)/, (msg, match) => {
  if (!isAdmin(msg.from.id)) return;

  const d = match[1].split(" ");
  currentPeriod = parseInt(d[0]);
  lastSize = d[2].toUpperCase();

  bot.sendMessage(msg.chat.id, "✅ Data saved.");
});

// START AUTO
bot.onText(/\/startauto/, (msg) => {
  if (!isAdmin(msg.from.id)) return;

  running = true;
  startExactTimer();
  bot.sendMessage(msg.chat.id, "⏱️ Auto prediction started.");
});

// STOP
bot.onText(/\/stop/, (msg) => {
  if (!isAdmin(msg.from.id)) return;

  running = false;
  bot.sendMessage(msg.chat.id, "⛔ Auto prediction stopped.");
});