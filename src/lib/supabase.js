* {
  box-sizing: border-box;
}

:root {
  color-scheme: dark;
  --bg: #060a10;
  --bg2: #0a1220;
  --panel: #0f1b2d;
  --line: #223250;
  --text: #f3ede0;
  --muted: #9fabbd;
  --orange: #ff6b1a;
  --green: #68e0a4;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Segoe UI', sans-serif;
}

img {
  max-width: 100%;
  display: block;
}

button, input, select, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: 1px solid var(--line);
  background: rgba(6, 10, 16, 0.96);
  backdrop-filter: blur(8px);
}

.brand {
  font-size: 1.1rem;
  letter-spacing: 0.18em;
  font-weight: 700;
}

.tag {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: var(--orange);
  margin-top: 4px;
}

.admin-panel {
  display: flex;
  align-items: center;
}

.admin-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-box input {
  width: 130px;
  background: #070d17;
  border: 1px solid #33435f;
  color: var(--text);
  padding: 0.7rem 0.8rem;
  border-radius: 8px;
}

.admin-box button,
.admin-on,
.primary-btn,
.secondary-btn {
  border: 1px solid #3a4a66;
  background: var(--orange);
  color: #1b0c03;
  font-weight: 700;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.admin-on {
  background: rgba(255, 107, 26, 0.12);
  color: #ffe3cf;
  border-color: rgba(255, 107, 26, 0.6);
}

.error {
  color: #ff7b7b;
  font-size: 0.75rem;
  margin-left: 8px;
}

.hero {
  padding: 72px 28px 54px;
  border-bottom: 1px solid var(--line);
  background: radial-gradient(circle at top left, rgba(150,60,255,0.35), transparent 28%),
    radial-gradient(circle at bottom right, rgba(255,64,128,0.2), transparent 30%),
    linear-gradient(160deg, #1b0b35, #0a0614 70%);
}

.hero-copy {
  max-width: 1100px;
  margin: 0 auto;
}

.eyebrow {
  display: inline-block;
  background: var(--orange);
  color: #1b0c03;
  border: 1px solid #ffa56a;
  padding: 6px 12px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 18px 0 12px;
  font-size: clamp(2.2rem, 4vw, 5rem);
  line-height: 1.1;
}

.hero p {
  font-size: 1.05rem;
  max-width: 620px;
  color: #d9d2e6;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 20px 60px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 26px;
}

.stat-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 22px;
}

.stat-card small {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--muted);
}

.stat-card strong {
  display: block;
  margin-top: 12px;
  font-size: 1.5rem;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
}

.form-panel {
  padding: 22px;
  margin-bottom: 22px;
}

.form-panel h3 {
  margin-top: 0;
}

.inventory-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.inventory-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.inventory-form input,
.inventory-form select,
.inventory-form textarea {
  width: 100%;
  border: 1px solid #33435f;
  background: #070d17;
  color: var(--text);
  padding: 0.8rem 0.9rem;
  border-radius: 8px;
}

.cards-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}

.media {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #1a2c4d, #060a10 85%);
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #c9d1de;
  font-weight: 700;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.7rem;
  font-weight: 700;
}

.badge.READY {
  background: var(--green);
  color: #06140d;
}

.badge.HOLD {
  background: #ffc156;
  color: #281300;
}

.badge.TERJUAL {
  background: #b94141;
  color: white;
}

.card-body {
  padding: 18px;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.type {
  color: #ff9a57;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.game-tag {
  border: 1px solid #475a7a;
  padding: 4px 8px;
  font-size: 0.7rem;
  border-radius: 999px;
}

.card h3 {
  margin: 0 0 10px;
  font-size: 1.4rem;
}

.spec {
  color: #c9d1de;
  min-height: 42px;
  margin: 0 0 16px;
}

.prices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.prices small {
  display: block;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.68rem;
}

.prices strong {
  display: block;
  margin-top: 4px;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 18px;
}

.secondary-btn {
  background: #101c2f;
  color: var(--text);
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.loader {
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: var(--muted);
}

@media (max-width: 640px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .admin-box {
    width: 100%;
    flex-wrap: wrap;
  }

  .admin-box input {
    flex: 1;
  }

  .actions {
    grid-template-columns: 1fr;
  }
}
