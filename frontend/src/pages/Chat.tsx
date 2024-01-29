import React from 'react'
import ChatList from '../components/chat/ChatList';

const Chat: React.FC = () => {
  return (
    <div className="flex" style={{ height: "calc(100vh - 4rem)" }}>
      <ChatList />
      <div className="w-3/4 p-4 bg-blue-50">Chat</div>
    </div>
  );
}

export default Chat;