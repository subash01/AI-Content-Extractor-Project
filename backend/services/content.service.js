const { OpenAI } = require('openai');
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fetchHtml(url) {
  const response = await fetch(url);
  return await response.text();
}

function cleanHtml(html) {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
             .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, ' ')
             .replace(/\s+/g, ' ')
             .trim();
}

exports.extractContentFromUrl = async (url) => {
  const rawHtml = await fetchHtml(url);
  const text = cleanHtml(rawHtml).slice(0, 5000);

  const prompt = `Extract a short summary and 5 key points from the following webpage content:\n\n"""${text}"""`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const resultText = completion.choices[0].message.content;
  const [summaryPart] = resultText.split('\n\n');

  const keyPoints = resultText
    .split('\n')
    .filter(line => /^([*\-]|\d+[.)])\s/.test(line))
    .map(line => line.replace(/^([*\-]|\d+[.)])\s/, '').trim());

  return {
    url,
    summary: summaryPart.trim(),
    key_points: keyPoints
  };
};