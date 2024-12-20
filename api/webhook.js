export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Webhook received:", req.body); // 打印收到的請求內容

    // 返回成功狀態碼給 LINE
    res.status(200).send("OK");
  } else {
    // 如果請求方法不是 POST，返回 405 錯誤
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
