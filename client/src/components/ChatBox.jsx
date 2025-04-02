import { useContext, useState } from "react";
import { WebSocketContext } from "../context/WebSocketContext";
import { AuthContext } from "../context/AuthContext";
import InputBox from "./InputBox";
import Message from "./Message";

const ChatBox = () => {
    const { socket } = useContext(WebSocketContext);
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);

    socket.onmessage = (event) => {
        setMessages((prev) => [...prev, JSON.parse(event.data)]);
    };

    return (
        <div className="p-4 w-full">
            <div className="h-[400px] overflow-auto border p-2">
                {messages.map((msg, index) => (
                    <Message key={index} msg={msg} user={user} />
                ))}
            </div>
            <InputBox socket={socket} user={user} />
        </div>
    );
};

export default ChatBox;
