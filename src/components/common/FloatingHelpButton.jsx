import { useState, useEffect } from "react";

export default function FloatingHelpButton() {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 3600);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open("https://ask-question-client.vercel.app/", "_blank");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@500;600&display=swap');

        @keyframes geminiShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulseRing {
          0%   { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0;   transform: scale(1.3); }
        }

        @keyframes liveBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }

        .fab-wrapper {
          position: fixed;
          bottom: 24px;
          right: 20px;
          z-index: 100;
          font-family: 'Google Sans', 'Segoe UI', sans-serif;
        }

        .fab-outer {
          position: relative;
          border-radius: 999px;
          padding: 2px;
          background: linear-gradient(
            270deg,
            #4285F4, #9B72CB, #D96570, #F4B400, #0F9D58, #4285F4
          );
          background-size: 300% 300%;
          animation: geminiShimmer 4s ease infinite;
          box-shadow: 0 4px 20px rgba(66, 133, 244, 0.22);
          transition: box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        .fab-outer:hover {
          box-shadow: 0 6px 28px rgba(66, 133, 244, 0.36);
          transform: translateY(-2px) scale(1.03);
        }

        .fab-outer:active {
          transform: scale(0.97);
        }

        .fab-inner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border-radius: 999px;
          padding: 10px 18px 10px 12px;
          cursor: pointer;
          border: none;
          outline: none;
          transition: background 0.2s ease;
        }

        .fab-inner:hover {
          background: #f8f9ff;
        }

        .fab-icon {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fab-icon svg {
          width: 22px;
          height: 22px;
        }

        .fab-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1;
        }

        .fab-title {
          font-size: 12px;
          font-weight: 600;
          color: #1f1f1f;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .fab-sub {
          font-size: 10px;
          font-weight: 500;
          margin-top: 3px;
          white-space: nowrap;
          background: linear-gradient(90deg, #4285F4, #9B72CB, #D96570);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .fab-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 999px;
          border: 2px solid rgba(66, 133, 244, 0.5);
          animation: pulseRing 1.1s ease-out 3;
          pointer-events: none;
        }

        .fab-dot {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 8px;
          height: 8px;
          background: #0F9D58;
          border-radius: 50%;
          border: 1.5px solid #fff;
          animation: liveBlink 2.4s ease-in-out infinite;
        }

        @media (max-width: 480px) {
          .fab-wrapper {
            bottom: 16px;
            right: 14px;
          }
          .fab-inner {
            padding: 9px 14px 9px 10px;
            gap: 6px;
          }
          .fab-icon svg {
            width: 18px;
            height: 18px;
          }
          .fab-title {
            font-size: 11px;
          }
          .fab-sub {
            display: none;
          }
        }
      `}</style>

      <div className="fab-wrapper">
        <div className="fab-outer">
          {pulse && <span className="fab-pulse" />}
          <span className="fab-dot" />

          <button className="fab-inner" onClick={handleClick} aria-label="Ask me anything">
            <span className="fab-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#4285F4"/>
                    <stop offset="40%"  stopColor="#9B72CB"/>
                    <stop offset="70%"  stopColor="#D96570"/>
                    <stop offset="100%" stopColor="#F4B400"/>
                  </linearGradient>
                </defs>
                <path
                  d="M12 2C12 2 13.2 8 17 9C20.8 10 22 12 22 12C22 12 20.8 14 17 15C13.2 16 12 22 12 22C12 22 10.8 16 7 15C3.2 14 2 12 2 12C2 12 3.2 10 7 9C10.8 8 12 2 12 2Z"
                  fill="url(#starGrad)"
                />
              </svg>
            </span>

            <span className="fab-text">
              <span className="fab-title">Ask me anything</span>
              <span className="fab-sub">I have every answer</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}