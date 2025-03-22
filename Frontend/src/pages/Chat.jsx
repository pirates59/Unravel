import React from "react";
import send from "../assets/send.png";
import leave from "../assets/leave.png";

const Chat = () => {
  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      {/* Top Bar with Title and Exit Button */}
      <div className="flex h-[70px] items-center justify-between bg-[#D9D9D9] px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500"></div>
          <h1 className="text-xl font-semibold">Anxiety</h1>
        </div>
        <div className="flex gap-3 items-end">
          <img src={leave} alt="Send" className="w-9 h-9" />
          <button className="bg-[#EC993D] text-white mb-0 px-6 py-2 rounded-md text-sm font-medium flex items-center">
            Exit
          </button>
        </div>
      </div>

      {/* Chat Messages Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* BOT Messages (Left-Aligned) */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            {/* BOT Avatar */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
              BOT
            </div>
            {/* BOT Message Bubble */}
            <div className="bg-white rounded-md shadow p-3 text-sm max-w-xl">
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s.
            </div>
          </div>
        ))}

        {/* YOU Message (Right-Aligned) */}
        <div className="flex justify-end">
          <div className="flex items-start space-x-3 justify-end">
            {/* YOU Message Bubble */}
            <div className="bg-[#7879F1] rounded-md shadow p-3 text-sm max-w-xl text-white">
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s.
            </div>
            {/* YOU Avatar */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#7879F1] text-white flex items-center justify-center font-bold">
              YOU
            </div>
          </div>
        </div>
      </div>

      {/* Message Input at the Bottom */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Type your message here..."
          />
          <button className="bg-[#7879F1] right-0 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center pr-3">
            <img src={send} alt="Send" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
