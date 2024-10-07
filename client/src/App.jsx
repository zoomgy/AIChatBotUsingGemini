import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";
import uuid from 'react-uuid';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"
const genAI = new GoogleGenerativeAI("AIzaSyAUBSn7CxKtTUPgTlA7wVW5s8418zBzVik");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const ai = model.startChat({
  history: [
    { role: "user", parts: [{ text: "Hello" }] },
    { role: "model", parts: [{ text: "Great to meet you. What would you like to know?" }] },
  ],
});

function App() {
  const navigate = useNavigate();
  useEffect( ()=>{
    try {
      (async ()=>{
        const response = await fetch("https://aichatbotusinggeminibackend.onrender.com/verify-token",{
          credentials: 'include'
        });
        const isAuthenticated = await response.json();
        if(!(isAuthenticated.message === 'Token is valid')){
            navigate("/login");
        }
      })();
    } catch (error) {
      console.log(error);
    }
  },[]);






  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([
    {
      type: "model",
      text: "Hi! How can I help you today?"
    }
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedChat = [...chat, { type: "user", text: query }];
    setChat(updatedChat);
    setQuery("");
    const result = await ai.sendMessage(query);
    const response = result.response.text();
    const updatedChat2 = [...updatedChat, { type: "model", text: response }];
    setChat(updatedChat2);
  };

  
const handleLogout = async () => {
  try {
    const response = await fetch("https://aichatbotusinggeminibackend.onrender.com/logout", {
      method: 'POST',
      credentials: 'include',
    });
    const data = await response.json();
    console.log(data);
    Cookies.remove('token');
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  return (
    <div className="flex gap-2 flex-col justify-center items-center w-full h-screen bg-gray-100 font-mono">
      <div className="h-full w-full max-w-2xl md:h-5/6 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 w-full h-5/6 flex flex-col gap-4 overflow-y-auto">
          {chat.map((prompt) => (
            <div className={prompt.type === "model" ? "flex justify-start" : "flex justify-end"} key={uuid()}>
              <p className={prompt.type === "model" ? "bg-gray-200 p-3 rounded-lg inline-block max-w-xs md:max-w-xl" : "bg-blue-400 p-3 rounded-lg inline-block max-w-xs md:max-w-md text-white"}>
                {prompt.text}
              </p>
            </div>
          ))}
        </div>
        <div className="w-full h-1/6 bg-gray-50 p-3">
          <form onSubmit={handleSubmit} className="flex flex-row justify-between items-center">
            <input
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              className="p-2 h-12 w-full text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="text"
              placeholder="Type your message..."
            />
            <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white p-2 rounded-md ml-2 transition-colors duration-200">
              Send
            </button>
          </form>
        </div>
      </div>
      <button onClick={handleLogout} className="bg-blue-200 p-3 hover:bg-blue-300 hover:rounded-lg transition-all">Logout</button>
    </div>
  );
}

export default App;
