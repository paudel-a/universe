import { useState } from "react";
import API from "../services/api";

function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = message;

    setChat((prev) => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", {
        message: userMsg,
      });

      setChat((prev) => [...prev, { sender: "ai", text: res.data.reply }]);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">AI Study Assistant</h1>

      <div className="border p-3 h-96 overflow-y-auto bg-white rounded">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`mb-2 ${
              c.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-1 rounded ${
                c.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {c.text}
            </span>
          </div>
        ))}

        {loading && <p>Thinking...</p>}
      </div>

      <div className="flex mt-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border flex-1 p-2"
          placeholder="Ask something..."
        />

        <button onClick={sendMessage} className="bg-blue-600 text-white px-4">
          Send
        </button>
      </div>
    </div>
  );
}

export default AIChat;
