import { useEffect, useState } from "react";

export default function Home() {
  const ACCESS_KEY = "insta_widget_access";

  const [accessCode, setAccessCode] = useState("");
  const [status, setStatus] = useState("checking");
  // checking | locked | loading | allowed | error

  useEffect(() => {
    const saved = localStorage.getItem(ACCESS_KEY);

    if (!saved) {
      setStatus("locked");
      return;
    }

    verifyToken(saved);
  }, []);

  async function verifyToken(token) {
    try {
      const res = await fetch("/api/check-widget-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.allowed === true) {
        localStorage.setItem(ACCESS_KEY, token);
        setStatus("allowed");
      } else {
        localStorage.removeItem(ACCESS_KEY);
        setStatus("locked");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  async function handleUnlock() {
    if (!accessCode.trim()) {
      alert("🌿 Enter your access code first");
      return;
    }

    setStatus("loading");
    await verifyToken(accessCode.trim());
  }

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "60px",
    background: "linear-gradient(135deg, #F4EFFA, #FAF5FF)",
    fontFamily: "system-ui",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    padding: "28px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "300px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  };

  const buttonStyle = {
    background: "#E6DBFF",
    border: "none",
    padding: "10px 22px",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
  };

  if (status === "checking") {
    return <div style={containerStyle}>Checking access…</div>;
  }

  if (status === "locked") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter access code"
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              textAlign: "center",
            }}
          />
          <button style={buttonStyle} onClick={handleUnlock}>
            Unlock Insta Widget
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return <div style={containerStyle}>Verifying… ✨</div>;
  }

  if (status === "error") {
    return <div style={containerStyle}>Connection issue… try again ✨</div>;
  }

  if (status === "allowed") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <strong>✨ Widget Unlocked ✨</strong>
        </div>
      </div>
    );
  }

  return null;
}
