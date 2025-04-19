const express = require('express');
const line = require('@line/bot-sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// 替換成你的 LINE Bot 憑證
const lineConfig = {
  channelAccessToken: process.env.IyOWn/tsJ9Iwy2V4e9jnyPL0eTdFWZZSf23YTLHlRJJ2PZxn9/7icTOpZD/f1snKkFNChl2lMr4Y2TdQn5Sk+YQiaN5qQBk+IE1Utm6rJBgIsMbY783aC1eX+dW7UKNZZZMRSVXGIcBl6BYnY7GzEQdB04t89/1O/w1cDnyilFU=,
  channelSecret: process.env.609e8cc1fa9cb7ac17c7b9453c6fc021
};
const client = new line.Client(lineConfig);

// 替換成你的 Gemini API 金鑰
const genAI = new GoogleGenerativeAI(process.AIzaSyBAAtB3fqV1NUNchLZwELH2cc6KPeEG3gU);

app.use(express.json());

app.post('/webhook', line.middleware(lineConfig), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).end())
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

async function callGemini(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini 錯誤:", error);
    return "⚠️ Gemini 目前無法回覆，請稍後再試～";
  }
}

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  const aiReply = await callGemini(event.message.text);
  return client.replyMessage(event.replyToken, { type: 'text', text: aiReply });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot 已啟動！`));
