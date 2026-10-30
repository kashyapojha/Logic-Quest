import { useState } from "react";
import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import Dashboard from "./pages/Dashboard";
import Arena from "./pages/Arena";
import CodeLab from "./pages/CodeLab";
import Dsa from "./pages/Dsa";
import { Login, Signup } from "./pages/Auth";
import {
  Achievements,
  AttemptsPage,
  Battles,
  Daily,
  Debug,
  Languages,
  Profile,
  ProgressPage,
  Readiness,
} from "./pages/More";

const nav: [string, string][] = [
  ["/", "Dashboard"],
  ["/arena", "Logic Arena"],
  ["/lab", "Visual Code Lab"],
  ["/dsa", "DSA Quest"],
  ["/languages", "Languages"],
  ["/debug", "Debugging Arena"],
  ["/daily", "Daily Challenge"],
  ["/battles", "Coding Battles"],
  ["/readiness", "Placement Readiness"],
  ["/progress", "Progress"],
  ["/attempts", "Attempts"],
  ["/achievements", "Achievements"],
  ["/profile", "Profile"],
];

function Soon({ title }: { title: string }) {
  return <div className="card"><h1>{title}</h1><p className="mut">This feature is not connected to the backend yet.</p></div>;
}

function RequireAuth() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading) return <main><div className="card" role="status">Checking your session...</div></main>;
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

function GuestOnly({ children }: { children: JSX.Element }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <main><div className="card" role="status">Checking your session...</div></main>;
  return currentUser ? <Navigate to="/" replace /> : children;
}

function AppShell() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const totalXp = currentUser?.stats.total_xp ?? 0;
  const level = currentUser?.stats.current_level ?? 0;
  const name = currentUser?.profile.full_name || currentUser?.profile.username || currentUser?.user.email || "Guest";

  function signOut() {
    logout();
    setMenu(false);
    navigate("/login", { replace: true });
  }

  return <div className="shell">
    <aside className={open ? "side open" : "side"}>
      <div className="brand">Logic<b>Quest</b></div>
      <nav>{nav.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}><span className="ic">{label[0]}</span><span>{label}</span></NavLink>)}</nav>
    </aside>
    <div className="main">
      <header className="top">
        <button className="ghost burger" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>Menu</button>
        <span className="shield" title="Level" aria-label={`Level ${level}`}>{level}</span>
        <span className="pill"><i className="orb" />{totalXp} XP</span>
        <span className="pill"><i className="flame" />{currentUser?.stats.current_streak ?? 0}</span>
        <div className="grow" />
        <div className="rel">
          <button className="ghost" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>{name}</button>
          {menu && <div className="menu" role="menu"><NavLink role="menuitem" to="/profile" onClick={() => setMenu(false)}>Profile</NavLink><button role="menuitem" onClick={signOut}>Sign out</button></div>}
        </div>
      </header>
      <main>
        <Outlet />
        <p className="mut small">Unconnected activities are labeled as demonstrations; XP and published challenge results come from the backend.</p>
      </main>
      <nav className="tabs">{nav.slice(0, 4).map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label.split(" ")[0]}</NavLink>)}<NavLink to="/profile">Profile</NavLink></nav>
    </div>
  </div>;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
    <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
    <Route element={<RequireAuth />}>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="arena" element={<Arena />} />
        <Route path="lab" element={<CodeLab />} />
        <Route path="dsa" element={<Dsa />} />
        <Route path="languages" element={<Languages />} />
        <Route path="debug" element={<Debug />} />
        <Route path="daily" element={<Daily />} />
        <Route path="battles" element={<Battles />} />
        <Route path="readiness" element={<Readiness />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="attempts" element={<AttemptsPage />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Soon title="Not found" />} />
      </Route>
    </Route>
  </Routes>;
}
