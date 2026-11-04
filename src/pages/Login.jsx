export default function Login() {
  return (
    <section className="auth-card">
      <p className="eyebrow">Pixel Quest account</p>
      <h1>Log in</h1>
      <p>This is a demo form. Real authentication will be added later.</p>
      <label>
        Email
        <input type="email" placeholder="you@example.com" />
      </label>
      <label>
        Password
        <input type="password" placeholder="••••••••" />
      </label>
      <button className="button" type="button">
        Log in
      </button>
    </section>
  );
}
