// Import required libraries
// Import required libraries
import { Bot, InlineKeyboard, webhookCallback } from "https://deno.land/x/grammy@v1.20.3/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Get token from environment variables
const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

// Validate token
if (!BOT_TOKEN) {
  console.error("ERROR: Telegram bot token not found in environment variables!");
  console.error("Please set the TELEGRAM_BOT_TOKEN environment variable");
  Deno.exit(1);
}

// Initialize bot
const bot = new Bot(7449086241:AAF1AyOQQt6Md_ilHfY0_otk4wIaHFARKDI);

// Channel information
const REQUIRED_CHANNEL = "https://t.me/+X0fkvzDpjvlmZTE1";
const CHANNEL_USERNAME = "NetflixOfficialFree_bot";

// Handle /start command
bot.command("start", async (ctx) => {
  // Check if user is in channel
  try {
    const member = await ctx.api.getChatMember(CHANNEL_USERNAME, ctx.from.id);
    if (member.status === "left" || member.status === "kicked") {
      // User not in channel, show join prompt
      const keyboard = new InlineKeyboard()
        .url("Join Channel", REQUIRED_CHANNEL)
        .text("Check Membership", "check_membership");
      
      await ctx.reply("Please join our channel first to use this bot!", {
        reply_markup: keyboard
      });
    } else {
      // User is in channel, show main message
      await sendMainMessage(ctx);
    }
  } catch (error) {
    console.error("Error checking channel membership:", error);
    await ctx.reply("There was an error verifying your channel membership. Please try again later.");
  }
});

// Handle membership check callback
bot.callbackQuery("check_membership", async (ctx) => {
  try {
    const member = await ctx.api.getChatMember(CHANNEL_USERNAME, ctx.from.id);
    if (member.status === "left" || member.status === "kicked") {
      await ctx.answerCallbackQuery({
        text: "You haven't joined the channel yet!",
        show_alert: true
      });
      
      const keyboard = new InlineKeyboard()
        .url("Join Channel", REQUIRED_CHANNEL)
        .text("Check Membership", "check_membership");
      
      await ctx.editMessageText("Please join our channel first to use this bot!", {
        reply_markup: keyboard
      });
    } else {
      await ctx.answerCallbackQuery({
        text: "Thanks for joining! You can now use the bot.",
      });
      await ctx.deleteMessage();
      await sendMainMessage(ctx);
    }
  } catch (error) {
    console.error("Error checking channel membership:", error);
    await ctx.answerCallbackQuery({
      text: "Error verifying membership. Please try again.",
      show_alert: true
    });
  }
});

// Function to send the main message
async function sendMainMessage(ctx: any) {
  const message = `🧧𝙉𝙤𝙩𝙞𝙘𝙚 - 𝘾𝙡𝙞𝙘𝙠 "𝙒𝙖𝙩𝙘𝙝 �𝙙𝙨" 𝙗𝙪𝙩𝙩𝙤𝙣 & 𝙘𝙡𝙤𝙨𝙚 𝙗𝙧𝙤𝙬𝙨𝙚𝙧 𝙩𝙖𝙗 𝙖𝙣𝙙 𝙘𝙡𝙞𝙘𝙠 𝙗𝙚𝙡𝙤𝙬 𝙡𝙞𝙣𝙠 𝙖𝙜𝙖𝙞𝙣 🌟

🧧🧧🧧🧧🧧🧧
ㅤㅤㅤㅤㅤ
 NETFLIX 
ㅤㅤㅤㅤㅤ
🧧🧧🧧🧧🧧🧧

Dev: @xunez`;

  const keyboard = new InlineKeyboard()
    .url("Open app", "https://netfree2.cc/mobile/home")
    .url("How to skip ads", REQUIRED_CHANNEL);

  await ctx.reply(message, {
    reply_markup: keyboard,
    disable_web_page_preview: true
  });
}

// Handle messages containing "6969:CODE" and delete them
bot.on("message", async (ctx) => {
  if (ctx.message?.text?.includes("6969:CODE")) {
    try {
      await ctx.deleteMessage();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }
});

// Error handling
bot.catch((err) => {
  console.error("Bot error:", err);
});

// Start the bot
if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
  // Webhook mode for Deno Deploy
  serve(webhookCallback(bot, "std/http"));
} else {
  // Polling mode for local development
  bot.start();
}

console.log("Bot is running...");
