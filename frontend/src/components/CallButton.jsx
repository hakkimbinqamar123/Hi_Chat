import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div style={{ position: "absolute", right: "24px", zIndex: 50 }}>
      <button
        onClick={handleVideoCall}
        title="Start video call"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00a884",
          padding: "8px"
        }}
      >
        <VideoIcon size={24} />
      </button>
    </div>
  );
}

export default CallButton;
