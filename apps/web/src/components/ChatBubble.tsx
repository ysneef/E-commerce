import { useEffect, useRef, useState } from 'react';
import { ClientApi } from '../api/apiRequest';

const BRAND_COLOR = '#8e00e8';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

interface ProductSuggestion {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
}

interface SupportArticle {
  id: string;
  title: string;
  content: string;
}

function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [suggestedProducts, setSuggestedProducts] = useState<ProductSuggestion[]>([]);
  const [supportArticles, setSupportArticles] = useState<SupportArticle[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, suggestedProducts, supportArticles]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setSuggestedProducts([]);
    setSupportArticles([]);

    const userMsg: Message = { id: Date.now(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await ClientApi.axiosPost({
        data: {
          endpoint: '/api/chat/send',
          params: { message: trimmed },
        },
      });

      const botText =
        response?.data?.reply ||
        'Sorry, I could not connect to the assistant right now. Please try again later.';

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', text: botText },
      ]);

      if (Array.isArray(response?.data?.suggestedProducts)) {
        setSuggestedProducts(response.data.suggestedProducts);
      }

      if (Array.isArray(response?.data?.supportArticles)) {
        setSupportArticles(response.data.supportArticles);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: 'Sorry, something went wrong. Please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleSend();
    }
  };

  return (
    <>
      <div
        className={`chatbox-shell ${open ? 'chatbox-shell--open' : ''}`}
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '88px',
          zIndex: 9999,
          display: 'flex',
          maxHeight: '480px',
          width: '340px',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '20px',
          background: '#fff',
          boxShadow: '0 20px 60px rgba(20, 12, 46, 0.24)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div
          className="chatbox-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: BRAND_COLOR,
            padding: '14px 18px',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className="chatbox-bot-icon"
              style={{
                display: 'flex',
                height: 36,
                width: 36,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                fontSize: 18,
              }}
            >
              {'🤖'}
            </div>
            <div className="chatbox-header-copy">
              <div style={{ fontSize: 15, fontWeight: 700 }}>Shoes Store Assistant</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>Online</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#fff', fontSize: 20 }}
          >
            x
          </button>
        </div>

        <div
          className="chatbox-body"
          style={{
            display: 'flex',
            maxHeight: '320px',
            flex: 1,
            flexDirection: 'column',
            gap: 10,
            overflowY: 'auto',
            background: 'linear-gradient(180deg, #f7f7f7 0%, #f1f1f1 100%)',
            padding: '14px 16px',
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`chatbox-row ${msg.role === 'user' ? 'chatbox-row--user' : 'chatbox-row--bot'}`}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animationDelay: `${index * 45}ms`,
              }}
            >
              <div
                className={`chatbox-message ${msg.role === 'user' ? 'chatbox-message--user' : 'chatbox-message--bot'}`}
                style={{
                  maxWidth: '78%',
                  borderRadius: msg.role === 'user' ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
                  background: msg.role === 'user' ? BRAND_COLOR : '#fff',
                  padding: '10px 14px',
                  color: msg.role === 'user' ? '#fff' : '#222',
                  fontSize: 14,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  boxShadow:
                    msg.role === 'user'
                      ? '0 10px 24px rgba(142, 0, 232, 0.22)'
                      : '0 8px 24px rgba(20, 12, 46, 0.08)',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chatbox-row chatbox-row--bot chatbox-typing">
              <div className="chatbox-message chatbox-message--bot chatbox-typing-pill">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {suggestedProducts.length > 0 && (
            <div className="chatbox-card-list" style={{ marginTop: 4, display: 'grid', gap: 10 }}>
              {suggestedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="chatbox-card"
                  style={{
                    border: '1px solid rgba(142, 0, 232, 0.08)',
                    borderRadius: 16,
                    background: '#fff',
                    padding: 12,
                    boxShadow: '0 10px 24px rgba(20, 12, 46, 0.08)',
                    animationDelay: `${120 + index * 55}ms`,
                  }}
                >
                  <div style={{ marginBottom: 4, fontWeight: 700 }}>{product.name}</div>
                  <div style={{ marginBottom: 8, fontSize: 12, color: '#555' }}>
                    {product.brand} - {product.category}
                  </div>
                  <div style={{ marginBottom: 8, fontWeight: 700, color: BRAND_COLOR }}>
                    ${product.price.toFixed(2)}
                  </div>
                  <button
                    onClick={() => window.open(`/product?id=${product.id}`, '_blank')}
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      border: 'none',
                      borderRadius: 12,
                      background: BRAND_COLOR,
                      padding: '8px 0',
                      color: '#fff',
                      transition: 'transform 180ms ease, box-shadow 180ms ease',
                    }}
                  >
                    View product
                  </button>
                </div>
              ))}
            </div>
          )}

          {supportArticles.length > 0 && (
            <div className="chatbox-card-list" style={{ marginTop: 4, display: 'grid', gap: 10 }}>
              {supportArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="chatbox-card"
                  style={{
                    border: '1px solid rgba(17, 24, 39, 0.06)',
                    borderRadius: 16,
                    background: '#fff',
                    padding: 12,
                    boxShadow: '0 10px 24px rgba(20, 12, 46, 0.08)',
                    animationDelay: `${120 + index * 55}ms`,
                  }}
                >
                  <div style={{ marginBottom: 4, fontWeight: 700 }}>{article.title}</div>
                  <div style={{ fontSize: 12, color: '#555' }}>{article.content}</div>
                </div>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div
          className="chatbox-inputbar"
          style={{
            display: 'flex',
            gap: 8,
            borderTop: '1px solid #eee',
            background: 'rgba(255,255,255,0.96)',
            padding: '10px 12px',
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={loading ? 'Checking our catalog...' : 'Type a message...'}
            disabled={loading}
            className="chatbox-input"
            style={{
              flex: 1,
              border: '1px solid #e0e0e0',
              borderRadius: 24,
              background: loading ? '#f4f4f4' : '#fff',
              padding: '8px 14px',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            onClick={() => void handleSend()}
            disabled={loading}
            className="chatbox-send"
            style={{
              display: 'flex',
              height: 38,
              width: 38,
              cursor: loading ? 'not-allowed' : 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              borderRadius: '50%',
              background: loading ? '#b98bf9' : BRAND_COLOR,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <button
        onClick={() => setOpen((value) => !value)}
        className={`chatbox-launcher ${open ? 'chatbox-launcher--open' : ''}`}
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 9999,
          display: 'flex',
          height: '56px',
          width: '56px',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: '50%',
          background: BRAND_COLOR,
          boxShadow: '0 4px 16px rgba(142,0,232,0.4)',
        }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </>
  );
}

export default ChatBubble;
