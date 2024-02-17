import React from 'react'

const ChatList: React.FC = () => {
  return (
    <div className="w-1/4 h-full border-2 shadow">
        <div className='h-full'>
        <input type="text" className="w-full h-10 p-2 border-0 border-blue-200" placeholder='Search...' />
        <div>
          
        </div>
        </div>
    </div>
  );
}

export default ChatList;
// overflow-y-scroll