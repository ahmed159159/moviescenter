import React, { useState } from "react";
import BotInterface from "./BotInterface";

function AiBot() {
  const [active, setActive] = useState(false);

  return (
    <div>
      <button
        onClick={() => setActive(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        Chat
      </button>
      {active && (
        <div className="fixed inset-0 flex items-end justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <BotInterface height={560} setActive={setActive} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AiBot;
