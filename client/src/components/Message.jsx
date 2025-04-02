const Message = ({ msg, user }) => {
    const isMine = msg.sender === user?.id;
    return (
        <div className={`flex ${isMine ? "justify-end" : "justify-start"} my-2`}>
            <span className={`p-2 rounded-md ${isMine ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
                {msg.text}
            </span>
        </div>
    );
};

export default Message;
