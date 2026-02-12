import { useEffect, useState } from "react";

export default function Home() {
  const ACCESS_KEY = "insta_widget_access";

  const [accessCode, setAccessCode] = useState("");
  const [status, setStatus] = useState("checking"); 
  // checking | locked | loading | allowed | error

  /* ------------------------------
     CHECK EXISTING TOKEN ON LOAD
  ------------------------------ */
  useEffect(() => {
    const saved = localStorage.getItem(ACCESS_KEY);

    if (!saved) {
      setStatus("locked");
      return;
    }

    verifyToken(saved);
  }, []);

  /* ------------------------------
     VERIFY TOKEN VIA API
  ------------------------------ */
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

  /* ------------------------------
     HANDLE UNLOCK CLICK
  ------------------------------ */
  async function handleUnlock() {
    if (!accessCode.trim()) {
      alert("🌿 Enter your access code first");
      return;
    }

    setStatus("loading");
    await verifyToken(accessCode.trim());
  }

  /* ------------------------------
     UI STATES
  ------------------------------ */

  if (status === "checking") {
    return (
      <Centered>
        <div>Checking access…</div>
      </Centered>
    );
  }

  if (status === "locked") {
    return (
      <Centered>
        <div className="unlock-card">
          <input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter access code"
          />
          <button
            className="unlock"
            onClick={handleUnlock}
          >
            Unlock Insta Widget
          </button>
        </div>
      </Centered>
    );
  }

  if (status === "loading") {
    return (
      <Centered>
        <div>Verifying… ✨</div>
      </Centered>
    );
  }

  if (status === "error") {
    return (
      <Centered>
        <div>Connection issue… try again ✨</div>
      </Centered>
    );
  }

  if (status === "allowed") {
    return (
      <Centered>
        <div>
          <strong>✨ Widget Unlocked ✨</strong>
        </div>
      </Centered>
    );
  }

  return null;
}

/* ------------------------------
   CENTER WRAPPER
------------------------------ */
function Centered({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 60,
        background: "linear-gradient(135deg, #F4EFFA, #FAF5FF)",
        fontFamily: "system-ui",
      }}
    >
      {children}
    </div>
  );
}
