import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCINk7Exxx3dc8FS8uX6d0H4OjD4kRUewg" });

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt, 
  });
  console.log(response.text);
  return response.text ;
}

 export default  main;
