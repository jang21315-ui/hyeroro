export default function Footer() {
  return (
    <footer className="site-footer">
      <div
        className="footer-inner"
        style={{
          padding: "36px 24px 42px",
        }}
      >
        <div
          style={{
            marginBottom: "12px",
            color: "#ffffff",
            fontSize: "17px",
            fontWeight: 800,
          }}
        >
          ⛏️ 혜로로
        </div>

        <p
          style={{
            margin: "0 0 6px",
            color: "#777f8b",
            fontSize: "12px",
          }}
        >
          혜로로 팬 커뮤니티
        </p>

        <p
          style={{
            margin: 0,
            color: "#4f5661",
            fontSize: "11px",
          }}
        >
          © 2026 혜로로. All rights reserved.
        </p>
      </div>
    </footer>
  );
}