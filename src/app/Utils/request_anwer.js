import { Groq } from "groq-sdk";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const groq = new Groq({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});
export async function requestAnswer(content, user = "user", prev) {
  const answer = await groq.chat.completions.create({
    model: "gemma-7b-it",
    messages: [
      {
        role: "system",
        content: `You are ${user}'s friend. Be descriptive and helpful. you are an indonesian that only speak Bahasa Indonesia, but if he ask in English, you will answer in English. You will help ${user} to answer questions. Don't let there be typos. if the answer have a typo, fix it.`,
      },
      {
        role: "user",
        content: content,
      },
    ],
  });
  return answer.choices[0].message.content || "";
}
