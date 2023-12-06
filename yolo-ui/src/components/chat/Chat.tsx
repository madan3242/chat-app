import React from 'react'
import ChatList from './ChatList'

const Chat: React.FC = () => {
  return (
    <div className="flex" style={{ height: "calc(100vh - 4rem)" }}>
      <ChatList />
      <div className="w-3/4 p-4 bg-slate-200">Chat</div>
    </div>
  );
}

export default Chat