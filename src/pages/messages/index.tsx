import { SetStateAction  } from "react";
import { useState } from "react";

function MessagesPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Chat 1",
      messages: ["Hello!", "How are you?", "Welcome to the chat!"],
    },
    {
      id: 2,
      name: "Chat 2",
      messages: ["Hey!", "What's up?", "How are you doing?"],
    },
  ]);

  const [currentChat, setCurrentChat] = useState(messages[0]); // Default to the first chat
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setCurrentChat({
        ...currentChat,
        messages: [...currentChat.messages, newMessage],
      });
      setNewMessage("");
    }
  };

  const handleChatClick = (
    chat: SetStateAction<{ id: number; name: string; messages: string[] }>
  ) => {
    setCurrentChat(chat);
  };

  return (
    <div className="p-4 flex h-screen">
      <div className="w-1/3 bg-white rounded-lg shadow-md p-4 space-y-2">
        <h1 className="text-xl font-bold mb-2">All Chats</h1>
        {messages.map((chat) => (
          <div
            key={chat.id}
            className="p-2 bg-gray-100 rounded-lg mb-1 cursor-pointer"
            onClick={() => handleChatClick(chat)}
          >
            {chat.name}
          </div>
        ))}
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <h1 className="text-2xl font-bold mb-4">{currentChat.name}</h1>
        <div className="w-full bg-white rounded-lg shadow-md p-4 space-y-2 overflow-auto flex-1">
          {currentChat.messages.map((msg, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded-lg">
              {msg}
            </div>
          ))}
        </div>
        <div className="mt-4 flex w-full sticky bottom-0">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l-lg focus:outline-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
