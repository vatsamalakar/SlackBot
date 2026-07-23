require("dotenv").config();

const axios = require("axios");
const { App } = require("@slack/bolt");

const botToken = process.env.SLACK_BOT_TOKEN;
const appToken = process.env.SLACK_APP_TOKEN;

if (!botToken || !appToken) {
  console.error("Missing Slack credentials. Set SLACK_BOT_TOKEN and SLACK_APP_TOKEN in Render.");
  process.exit(1);
}

if (!botToken.startsWith("xoxb-")) {
  console.error("SLACK_BOT_TOKEN looks invalid. It should start with xoxb-");
  process.exit(1);
}

if (!appToken.startsWith("xapp-")) {
  console.error("SLACK_APP_TOKEN looks invalid. It should start with xapp-");
  process.exit(1);
}

const app = new App({
  token: botToken,
  appToken: appToken,
  socketMode: true
});

app.command("/super_bot-ping", async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/super_bot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/super_bot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text: `${response.data.setup}\n\n${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/super_bot-quote", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    const quote = response.data[0];
    await respond({ text: `"${quote.q}"\n— ${quote.a}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a quote." });
  }
});

app.command("/super_bot-dadjjoke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: { Accept: "application/json" }
    });
    await respond({ text: response.data.joke });
  } catch (err) {
    await respond({ text: "Failed to fetch a dad joke." });
  }
});

app.command("/super_bot-8ball", async ({ ack, respond }) => {
  await ack();

  const answers = [
    "Yes, definitely.",
    "Absolutely.",
    "Not likely.",
    "Ask again later.",
    "The signs point to yes.",
    "Outlook seems good.",
    "Very doubtful."
  ];

  const answer = answers[Math.floor(Math.random() * answers.length)];
  await respond({ text: `🎱 ${answer}` });
});

app.command("/super_bot-coinflip", async ({ ack, respond }) => {
  await ack();
  const result = Math.random() < 0.5 ? "Heads" : "Tails";
  await respond({ text: `🪙 ${result}` });
});

app.command("/super_bot-rps", async ({ ack, respond }) => {
  await ack();

  const choices = ["rock", "paper", "scissors"];
  const botChoice = choices[Math.floor(Math.random() * choices.length)];
  const userChoice = choices[Math.floor(Math.random() * choices.length)];

  let result = "Tie!";
  if (
    (userChoice === "rock" && botChoice === "scissors") ||
    (userChoice === "paper" && botChoice === "rock") ||
    (userChoice === "scissors" && botChoice === "paper")
  ) {
    result = "You win!";
  } else if (
    (botChoice === "rock" && userChoice === "scissors") ||
    (botChoice === "paper" && userChoice === "rock") ||
    (botChoice === "scissors" && userChoice === "paper")
  ) {
    result = "Bot wins!";
  }

  await respond({ text: `🪨📄✂️ You picked ${userChoice} and I picked ${botChoice}. ${result}` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();












































































































































































































































































































































































































