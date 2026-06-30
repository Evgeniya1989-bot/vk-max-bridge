const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VK_CONFIRMATION_CODE = "4b5e6273";
const MAX_TOKEN = process.env.MAX_TOKEN;
const MAX_CHAT_ID = process.env.MAX_CHAT_ID;

app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    if (data.type === "confirmation") {
      return res.send(VK_CONFIRMATION_CODE);
    }

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

    return res.send("ok");
  } catch (e) {
    console.error(e);
    return res.send("error");
  }
});
app.get("/chats", async (req, res) => {
  try {
    const response = await axios.get("https://botapi.max.ru/chats", {
      headers: {
        Authorization: `Bearer ${MAX_TOKEN}`
      }
    });

    return res.json(response.data);
  } catch (e) {
    console.error(e.response?.data || e.message);
    return res.status(500).json({
      error: e.response?.data || e.message
    });
  }
});
app.post("/max-webhook", (req, res) => {
  console.log("MAX UPDATE:", JSON.stringify(req.body, null, 2));
  return res.send("ok");
});
app.listen(process.env.PORT || 3000);
