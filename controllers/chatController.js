import db from "../db/database.js";
import dotenv from "dotenv";

dotenv.config();

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error.message}`);
    }

    const data = await response.json();
    const botResponse = data.choices[0].message.content;

    await db.execute(
      "INSERT INTO messages (user_message, bot_response) VALUES (?, ?)",
      [message, botResponse]
    );

    res.json({ response: botResponse });
  } catch (error) {
    console.error("Fel vid AI-anrop:", error.message);
    res.status(500).json({ error: "Serverfel" });
  }
};
