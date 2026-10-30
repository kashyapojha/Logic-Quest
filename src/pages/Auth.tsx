import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login, signup } from "../services/api";
import { useAuth } from "../auth/useAuth";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { refreshMe, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname ?? "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    clearError();
    setSubmitting(true);
    try {
      const response = await login({ email: email.trim(), password });
      if (!response.session?.access_token) {
        throw new Error("Login did not return an access token. Please try again.");
      }
      await refreshMe();
      navigate(from, { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <div className="brand">Logic<b>Quest</b></div>
        <h1>Welcome back</h1>
        <p className="mut">Log in to continue your progress.</p>
        {authError && <p className="err" role="alert">{authError}</p>}
        <label>Email<br /><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<br /><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="err" role="alert">{error}</p>}
        <button className="btn" disabled={submitting}>{submitting ? "Logging in..." : "Log in"}</button>
        <p className="small">New to LogicQuest? <Link to="/signup">Create an account</Link></p>
      </form>
    </main>
  );
}

export function Signup() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { refreshMe } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const response = await signup({
        username: username.trim(),
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });
      if (!response.session?.access_token) {
        setMessage("Account created. Check your email to verify it, then log in.");
        return;
      }
      await refreshMe();
      navigate("/", { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <div className="brand">Logic<b>Quest</b></div>
        <h1>Create your account</h1>
        <p className="mut">Your challenge progress is saved to your account.</p>
        <label>Username<br /><input autoComplete="username" required maxLength={32} value={username} onChange={(event) => setUsername(event.target.value)} /></label>
        <label>Full name<br /><input autoComplete="name" maxLength={100} value={fullName} onChange={(event) => setFullName(event.target.value)} /></label>
        <label>Email<br /><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password (at least 8 characters)<br /><input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="err" role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        <button className="btn" disabled={submitting}>{submitting ? "Creating account..." : "Sign up"}</button>
        <p className="small">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
