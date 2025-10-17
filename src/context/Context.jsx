import { createContext, useState } from "react";
import main from "../config/gemini.js";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    // Displays the word with a delay, creating a typing effect
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, index * 50); // 50ms delay per word
  };

  const onsent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await main(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await main(input);
    }

    // 1. Process the response to replace ** with <b>...</b>
    let responseArray = response.split("**");
    let newArray = "";
    for (let i = 0; i < responseArray.length; i++) {
      // If the index is even, it's normal text. If odd, it's bold text.
      if (i % 2 === 0) {
        newArray += responseArray[i];
      } else {
        newArray += "<b>" + responseArray[i] + "</b>";
      }
    }

    // 2. Replace newline characters (\n) with HTML <br/> for formatting
    let finalResponse = newArray.split("\n").join("<br/>");

    // 3. Implement the typing effect
    let newResponseArray = finalResponse.split(" ");

    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + (i < newResponseArray.length - 1 ? " " : ""));
    }

    setLoading(false);
    setInput("");
  };

  const contextvalue = {
    prevPrompts,
    setPrevPrompts,
    onsent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextvalue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
