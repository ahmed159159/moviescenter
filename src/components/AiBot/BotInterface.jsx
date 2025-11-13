import React, { useEffect, useRef, useState } from "react";
import ChatbotIcon from "../../assets/chatbot";
import Message from "./Message";
import { InitialPrompt } from "../../assets/chatbot";
import { FIREWORKS_KEY, FIREWORKS_MODEL } from "../../assets/key";

// Simple Fireworks fetch wrapper
async function callFireworks(prompt) {
  try {
    const res = await fetch("https://api.fireworks.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIREWORKS_KEY}`,
      },
      body: JSON.stringify({
        model: FIREWORKS_MODEL,
        prompt: prompt,
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Fireworks API error: ${res.status} ${txt}`);
    }

    const j = await res.json();
    return j.output || j.text || JSON.stringify(j);

  } catch (e) {
    console.error("Fireworks error:", e);
    throw e;
  }
}

function BotInterface({ height = 700, setActive }) {

  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const obj = {
      user: "Popcorn Pilot",
      msg: {
        movieNames: [],
        message:
          "Hey there! 🍿 I'm Popcorn Pilot, your movie navigator. Ask me anything about movies!",
      },
    };
    if (messageHistory.length === 0) setMessageHistory([obj]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messageHistory]);

  const fetchData = async (userPrompt) => {
    setIsLoading(true);

    try {
      const prompt =
        InitialPrompt + "\nUser: " + userPrompt + "\nAssistant:";
      const resultText = await callFireworks(prompt);

      let responseMessage = resultText;
      try {
        const parsed = JSON.parse(resultText);
        responseMessage =
          parsed.message ||
          parsed.text ||
          JSON.stringify(parsed);
      } catch (_) {}

      setMessageHistory((prev) => [
        ...prev,
        {
          user: "Popcorn Pilot",
          msg: { movieNames: [], message: responseMessage },
        },
      ]);
    } catch (error) {
      setMessageHistory((prev) => [
        ...prev,
        {
          user: "Popcorn Pilot",
          msg: {
            movieNames: [],
            message: "Oops! Something went wrong.",
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    if (message.trim() === "" || isLoading) return;

    const newMessage = {
      user: "You",
      msg: { movieNames: [], message },
    };

    setMessageHistory((prev) => [...prev, newMessage]);
    fetchData(message);
    setMessage("");
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-4 flex flex-col mx-auto text-black"
      style={{
        height: `${height}px`,
        width: "95%",
        maxWidth: "500px",
        backgroundImage:
          "url('https://media1.tenor.com/m/S89fWSFaFowAAAAd/colors-pattern.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-between">
        <div className="flex justify-center items-center p-1 h-15 w-15">
          <ChatbotIcon />
        </div>

        <img
          src="https://media.tenor.com/NGFeo-Nn7WQAAAAi/milk-and-mocha-popcorn.gif"
          alt="watchingTV"
          className="absolute h-16 sm:h-20 top-2 left-1/2 -translate-x-1/2"
        />

        <button
          className="text-2xl font-bold hover:scale-150 duration-300 hover:text-red-600"
          onClick={() => setActive(false)}
        >
          X
        </button>
      </div>

      <div
        className="relative rounded-xl overflow-hidden"
        style={{ height: `calc(${height}px - 100px)` }}
      >
        <div className="absolute inset-0 bg-gray-100 opacity-30"></div>

        <div
          ref={chatContainerRef}
          className="relative flex-grow overflow-auto p-3 h-full"
        >
          {messageHistory.map((msg, index) => (
            <Message key={index} msgObj={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start my-2">
              <div className="bg-white p-3 rounded-lg max-w-xs text-black">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center mt-3 border border-gray-300 rounded-lg px-3 py-2 bg-white">
        <input
          type="text"
          className="flex-grow outline-none bg-transparent text-black"
          placeholder="Type a message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          className={`ml-2 ${
            isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl`}
          onClick={sendMessage}
        >
          {isLoading ? "…" : "▲"}
        </button>
      </div>
    </div>
  );
}

export default BotInterface;
