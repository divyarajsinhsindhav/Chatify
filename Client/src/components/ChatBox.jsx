import { useState, useEffect, useRef } from "react";
import { useParams, useMatch, Link, useNavigate } from "react-router-dom";
import socket from "../utils/socketConnection";
import apiFetch from "../utils/apiFetch";

const token = localStorage.getItem("token");

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { id: roomId } = useParams();
  const match = useMatch("/chatroom/:id");
  const bottomRef = useRef(null);
  const [roomExists, setRoomExists] = useState(null); // null indicates checking state
  const navigate = useNavigate();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        room: roomId,
        token: token,
        content: message,
        date: `${new Date().getDate()}/${
          new Date().getMonth() + 1
        }/${new Date().getFullYear()}`,
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  useEffect(() => {
    if (match) {
      const checkRoomExists = async () => {
        try {
          const response = await apiFetch(`/api/chatroom/info/${roomId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            setRoomExists(true);
          } else if (response.status === 404) {
            setRoomExists(false);
            setTimeout(() => {
              navigate("/chatroom");
            }, 5000);
          }
        } catch (err) {
          console.error("Error checking room existence:", err);
          setRoomExists(false);
        }
      };
      checkRoomExists();
    }
  }, [roomId, match]);

  useEffect(() => {
    if (!roomId || !token || roomExists === null) return;

    if (roomExists) {
      socket.emit("joinRoom", { roomId, token });
    }
  }, [roomId, token, roomExists]);

  useEffect(() => {
    if (!match || !roomExists) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/messages?roomId=${roomId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error("Failed to fetch messages.");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    socket.on("message", fetchMessages);

    return () => {
      socket.off("message", fetchMessages);
    };
  }, [roomId, match, roomExists, token]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!match)
    return (
      <div className="flex flex-col items-center justify-center h-full text-lg">
        Select a chat room to start messaging
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      {roomExists === null ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Checking room existence...</div>
        </div>
      ) : roomExists ? (
        <>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
              <Link to={`/chatroom/info/${roomId}`}>
                {roomId[0].toUpperCase()}
              </ Link>
            </div>
            <h2 className="text-2xl font-bold">
              <Link
                to={`/chatroom/info/${roomId}`}
                className="text-blue-600"
              >
                {roomId}
              </Link>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-900 border border-gray-700 rounded-md">
            {messages.map((msg, index) => (
              <div key={index} className="mb-4 p-2 rounded bg-gray-800">
                <div className="flex items-center mb-1">
                  <div className="font-semibold text-white">
                    {msg.sender.username}
                  </div>
                  <div className="text-xs text-gray-500 ml-2">
                    on {msg.date} @ {msg.time}
                  </div>
                </div>
                <div className="text-sm text-gray-300">{msg.content}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex mt-4 bg-gray-900 border-t border-gray-700 p-3 rounded-md shadow-lg"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border-none rounded-l-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2.929 6.343a1 1 0 010-1.414l6.364-6.364a1 1 0 011.414 0l6.364 6.364a1 1 0 01-1.414 1.414L10 2.828V18a1 1 0 11-2 0V2.828L4.343 4.929a1 1 0 01-1.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Chat Room Not Found
          </h2>
          <p className="text-gray-400">
            The chat room you are trying to access does not exist.
          </p>
          <p className="text-green-600">
            After 5 Seconds you redirected to Chat Room
          </p>
          <p className="text-blue-600 mt-4">OR</p>
          <Link to="/chatroom" className="mt-4 text-blue-600 hover:underline">
            Click here to Go back to chat rooms
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
