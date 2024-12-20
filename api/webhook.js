export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Webhook received:", req.body); // 打印收到的請求內容

      // 處理 Webhook 請求的邏輯
      const responseBody = await processWebhookRequest(req.body);

      // 返回成功狀態碼給 LINE
      res.status(200).send(responseBody);
    } catch (error) {
      console.error("Error processing webhook request:", error);

      // 返回錯誤狀態碼給 LINE
      res.status(500).send("Internal Server Error");
    }
  } else {
    // 如果請求方法不是 POST，返回 405 錯誤
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// 處理 Webhook 請求邏輯
async function processWebhookRequest(body) {
  if (!body || !body.events || body.events.length === 0) {
    console.warn("No events found in the request body");
    return "No events to process";
  }

  const events = body.events;

  for (const event of events) {
    // 打印事件類型
    console.log(`Processing event: ${event.type}`);

    // 處理不同類型的事件
    switch (event.type) {
      case "message":
        await handleMessageEvent(event);
        break;
      case "follow":
        console.log(`New follower: ${event.source.userId}`);
        break;
      case "join":
        console.log(`Bot joined group: ${event.source.groupId}`);
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  }

  return "Events processed";
}

// 處理 message 類型的事件
async function handleMessageEvent(event) {
  if (event.message.type === "text") {
    console.log(
      `User ${event.source.userId} sent message: ${event.message.text}`
    );

    // 在此處執行自定義邏輯，例如發送回應消息
    await sendReply(event.replyToken, `您說了：「${event.message.text}」`);
  } else {
    console.log(`Received unsupported message type: ${event.message.type}`);
  }
}

// 發送回應消息
async function sendReply(replyToken, messageText) {
  const axios = require("axios");

  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      {
        replyToken: replyToken,
        messages: [
          {
            type: "text",
            text: messageText,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer {YOUR_CHANNEL_ACCESS_TOKEN}`, // 替換為您的 Channel Access Token
        },
      }
    );

    console.log("Reply sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending reply:",
      error.response ? error.response.data : error.message
    );
  }
}
