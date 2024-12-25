'use client'

import { useState, ChangeEvent, FormEvent } from 'react';

type Message = {
  user: boolean;
  text: string;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const toggleChat = (): void => {
    setIsOpen((prev) => !prev);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!userInput) return;

    const newMessages: Message[] = [...messages, { user: true, text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from chatbot');
      }

      const data = await response.json();
      setMessages([...newMessages, { user: false, text: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: isOpen ? '300px' : '60px',
        height: isOpen ? '400px' : '60px',
        borderRadius: '10px',
        backgroundColor: '#f1f1f1',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        zIndex: 9999,
        padding: isOpen ? '10px' : '0',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4 style={{ margin: 0, display: isOpen ? 'block' : 'none' }}>Chat with us!</h4>
        <button
          onClick={toggleChat}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {isOpen ? '-' : '+'}
        </button>
      </div>

      {isOpen && (
        <div>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '10px',
              padding: '5px',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.user ? 'right' : 'left' }}>
                <div
                  style={{
                    backgroundColor: msg.user ? '#4CAF50' : '#ddd',
                    color: msg.user ? 'white' : 'black',
                    padding: '8px',
                    borderRadius: '5px',
                    margin: '5px 0',
                    maxWidth: '80%',
                    display: 'inline-block',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex' }}>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type a message..."
              style={{
                width: '80%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginRight: '10px',
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
