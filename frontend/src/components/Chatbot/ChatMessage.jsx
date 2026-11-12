import React from 'react';
import { Bot, User } from 'lucide-react';

/**
 * Helper to render simple markdown-like text (bold, bullet points, code block, line breaks)
 */
function renderFormattedText(text) {
  if (!text) return null;

  // Split into paragraphs/lines
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Check if line is a bullet item
    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
    const cleanLine = isBullet ? line.trim().replace(/^[•\-]\s*/, '') : line;

    // Check for code block markup ``` ... ```
    if (line.trim().startsWith('```') || line.trim().endsWith('```')) {
      return (
        <pre key={lineIdx} className="bg-slate-800 text-emerald-300 p-2 rounded-lg text-xs font-mono my-1 overflow-x-auto">
          {cleanLine.replace(/```/g, '')}
        </pre>
      );
    }

    // Parse bold text **bold** and italic *italic*
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanLine.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-inherit">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-inherit opacity-90">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.substring(lastIndex));
    }

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-1.5 my-0.5">
          <span className="text-emerald-500 font-bold select-none">•</span>
          <span className="flex-1">{parts.length > 0 ? parts : cleanLine}</span>
        </div>
      );
    }

    // Empty lines act as spacing
    if (!cleanLine.trim()) {
      return <div key={lineIdx} className="h-2" />;
    }

    return (
      <p key={lineIdx} className="my-0.5 leading-relaxed">
        {parts.length > 0 ? parts : cleanLine}
      </p>
    );
  });
}

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';
  const timeString = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
    : '';

  return (
    <div
      className={`flex items-start gap-2.5 my-2.5 animate-fadeIn ${isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${isUser
            ? 'bg-slate-700'
            : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20'
          }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content Bubble */}
      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs ${isUser
              ? 'bg-emerald-600 text-white rounded-tr-xs'
              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
            }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          ) : (
            <div className="space-y-0.5">{renderFormattedText(message.text)}</div>
          )}
        </div>

        {/* Timestamp */}
        {timeString && (
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {timeString}
          </span>
        )}
      </div>
    </div>
  );
}

