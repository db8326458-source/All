import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, User, CheckCheck, Clock } from 'lucide-react';
import { Booking } from '../../types';

interface ChatModalProps {
  booking: Booking;
  currentRole: 'customer' | 'partner';
  onClose: () => void;
}

export const CustomerChatModal: React.FC<ChatModalProps> = ({ booking, currentRole, onClose }) => {
  const { messages, sendMessage, currentCustomer, currentPartner } = useApp();
  const [inputText, setInputText] = useState('');

  const bookingMessages = messages.filter(m => m.bookingId === booking.id);

  const myId = currentRole === 'customer' ? currentCustomer.id : currentPartner.id;
  const myName = currentRole === 'customer' ? currentCustomer.fullName : booking.professionalName;
  const otherName = currentRole === 'customer' ? booking.professionalName : booking.customerName;

  const quickReplies = currentRole === 'customer'
    ? [
        'What is your estimated arrival time?',
        'I am at home and waiting.',
        'Please call when you reach the lobby.',
        'Can I pay via cash or card?'
      ]
    : [
        'I am on my way now.',
        'I will arrive in approximately 15 minutes.',
        'I have the required replacement parts.',
        'I am parked downstairs.'
      ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(booking.id, currentRole, myId, myName, inputText);
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    sendMessage(booking.id, currentRole, myId, myName, text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl h-[85vh] sm:h-[650px] flex flex-col overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentRole === 'customer' ? booking.professionalAvatar : currentCustomer.avatarUrl}
                alt={otherName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{otherName}</h3>
              <p className="text-[11px] text-blue-300">Ref: {booking.referenceNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          <div className="text-center my-2">
            <span className="text-[10px] bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-medium">
              Booking conversation started for {booking.specificIssue}
            </span>
          </div>

          {bookingMessages.map((msg) => {
            const isMe = msg.senderRole === currentRole;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                  </div>
                </div>
              </div>
            );
          })}

          {bookingMessages.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No messages yet. Send a note or use one of the quick replies below!
            </div>
          )}
        </div>

        {/* Quick Replies Carousel */}
        <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickReply(qr)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap font-medium transition-colors"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2.5 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
