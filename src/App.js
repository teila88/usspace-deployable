import React, { useState } from 'react';

export default function UsSpaceApp() {
  const [messages, setMessages] = useState([
    { sender: 'Teila', text: "I’m tired of repeating myself." },
    { sender: 'Partner', text: "I just didn’t know it mattered that much." },
  ]);
  const [input, setInput] = useState('');
  const [bufferMode, setBufferMode] = useState(false);
  const [bufferReason, setBufferReason] = useState('');

  const emotionallyChargedPhrases = [
    'always', 'never', 'whatever', 'i don’t care',
    'you don’t care', 'you never listen',
    'this is your fault', 'you’re so', 'stupid', 'fuck', 'bitch',
    'i guess you', 'like you even care',
  ];

  const abuseIndicators = [
    'you’re worthless', 'no one else would want you', 'you can’t leave',
    'i control', 'you have to', 'it’s your fault i’m like this'
  ];

  const checkForTriggers = (text) => {
    const lower = text.toLowerCase();
    for (let phrase of abuseIndicators) {
      if (lower.includes(phrase)) {
        setBufferReason('This message contains language that may indicate emotional abuse or control. Let’s pause.');
        return true;
      }
    }
    for (let phrase of emotionallyChargedPhrases) {
      if (lower.includes(phrase)) {
        setBufferReason('This message may escalate the conflict. Want to edit or send anyway?');
        return true;
      }
    }
    return false;
  };

  const generateGPTResponse = (newMessages) => {
    const fullText = newMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    let reply = '';
    if (fullText.includes('I’m tired of repeating myself') && fullText.includes('didn’t know it mattered')) {
      reply = 'This sounds like a recurring communication breakdown. What needs are going unmet here?';
    } else if (fullText.toLowerCase().includes('always') || fullText.toLowerCase().includes('never')) {
      reply = 'Notice the use of absolutes. This can shut down the conversation rather than open it up.';
    } else {
      reply = 'Keep focused on what each person is feeling and needing—not just what went wrong.';
    }
    setMessages([...newMessages, { sender: 'GPT', text: reply }]);
  };

  const handleSend = () => {
    const newMessages = [...messages, { sender: 'You', text: input }];
    setMessages(newMessages);
    setInput('');
    setBufferMode(false);
    setBufferReason('');
    generateGPTResponse(newMessages);
  };

  const handleBufferCheck = () => {
    if (checkForTriggers(input)) {
      setBufferMode(true);
    } else {
      handleSend();
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">UsSpace - Shared Chat</h1>
      <div className="border p-4 rounded-lg h-80 overflow-y-scroll bg-white shadow">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded shadow"
          rows="3"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {bufferMode && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-2 mt-2 rounded">
            {bufferReason}
            <div className="mt-2 flex space-x-2">
              <button onClick={() => setBufferMode(false)} className="px-4 py-1 bg-gray-200 rounded">Edit Message</button>
              <button onClick={handleSend} className="px-4 py-1 bg-blue-500 text-white rounded">Send Anyway</button>
            </div>
          </div>
        )}
        {!bufferMode && (
          <button onClick={handleBufferCheck} className="mt-2 w-full bg-blue-600 text-white py-2 rounded shadow">Send</button>
        )}
      </div>
    </div>
  );
}