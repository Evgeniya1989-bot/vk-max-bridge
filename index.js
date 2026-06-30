const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VK_TOKEN = process.env.VK_TOKEN;
const MAX_TOKEN = process.env.MAX_TOKEN;
const MAX_CHAT_ID = process.env.MAX_CHAT_ID;

app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    if (data.type === "message_new") {
      const message = data.object.message;

      const text =
        `💬 Новое сообщение из ВК\n\n` +
        `От: ${message.from_id}\n` +
        `${message.text || "(без текста)"}`;

      await axios.post(
        "https://botapi.max.ru/messages",
        {
          chat_id: MAX_CHAT_ID,
          text: text
        },
        {
          headers: {
            Authorization: `Bearer ${MAX_TOKEN}`
          }
        }
      );
    }

    res.send("ok");
  } catch (e) {
    console.error(e);
    res.send("error");
  }
});

app.listen(process.env.PORT || 3000);
