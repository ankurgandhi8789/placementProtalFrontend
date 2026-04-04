import { useState, useEffect } from "react";

export default function FloatingHelpButton() {
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open("https://ask-question-client.vercel.app/", "_blank");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&display=swap');

        .float-btn-wrap {
          position: fixed;
          bottom: 32px;
          right: 28px;
          z-index: 9999;
          font-family: 'Syne', sans-serif;
        }

        .float-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
          border: 1.5px solid rgba(99, 179, 237, 0.35);
          border-radius: 999px;
          padding: 14px 24px 14px 18px;
          cursor: pointer;
          box-shadow:
            0 8px 32px rgba(0,0,0,0.45),
            0 0 0 0 rgba(99,179,237,0.4),
            inset 0 1px 0 rgba(255,255,255,0.07);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-decoration: none;
          outline: none;
          position: relative;
          overflow: hidden;
        }

        .float-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,179,237,0.12), rgba(160,108,255,0.08));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 999px;
        }

        .float-btn:hover::before {
          opacity: 1;
        }

        .float-btn:hover {
          transform: translateY(-3px) scale(1.04);
          border-color: rgba(99, 179, 237, 0.7);
          box-shadow:
            0 16px 48px rgba(0,0,0,0.5),
            0 0 28px rgba(99,179,237,0.2),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .float-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #63b3ed, #a06cff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 18px;
          box-shadow: 0 0 12px rgba(99,179,237,0.4);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .float-btn:hover .btn-icon {
          transform: rotate(15deg) scale(1.1);
        }

        .btn-text-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .btn-label {
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: 0.04em;
          line-height: 1;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .btn-sub {
          font-size: 11px;
          font-weight: 600;
          color: #63b3ed;
          letter-spacing: 0.02em;
          margin-top: 3px;
          line-height: 1;
          white-space: nowrap;
        }

        /* Pulse ring animation on initial load */
        .pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          border: 2px solid rgba(99, 179, 237, 0.6);
          animation: pulseRing 1.2s ease-out 3;
          pointer-events: none;
        }

        @keyframes pulseRing {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.18); }
        }

        /* Dot indicator */
        .live-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: #48bb78;
          border-radius: 50%;
          box-shadow: 0 0 6px #48bb78;
          animation: liveBlink 2s ease-in-out infinite;
        }

        @keyframes liveBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>

      <div className="float-btn-wrap">
        <button
          className="float-btn"
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Ask a question - I have the solution to every question"
        >
          {pulse && <span className="pulse-ring" />}
          <span className="live-dot" />

          <span className="btn-icon">💡</span>

          <span className="btn-text-block">
            <span className="btn-label">Got a Question?</span>
            <span className="btn-sub">I have every answer ✦</span>
          </span>
        </button>
      </div>
    </>
  );
}