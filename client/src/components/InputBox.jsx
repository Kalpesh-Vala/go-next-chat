import { useState } from "react";

const InputBox = ({ socket, user }) => {
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        if (message.trim()) {
            socket.send(JSON.stringify({ sender: user.id, text: message }));
            setMessage("");
        }
    };

    return (
        <div className="flex mt-2">
            <input
                type="text"
                className="flex-1 p-2 border rounded-md"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button className="ml-2 p-2 bg-blue-500 text-white rounded-md" onClick={sendMessage}>
                Send
            </button>
        </div>
    );
};

export default InputBox;
