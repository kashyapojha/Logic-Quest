import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IslandMap from "../components/IslandMap";
import { getDashboard, getProgress, type Dashboard as DashboardData, type Progress } from "../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getDashboard(), getProgress()])
      .then(([data, items]) => {
        if (!active) return;
        setDashboard(data);
        setProgress(items);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load dashboard.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <div className="card" role="status">Loading dashboard...</div>;
  if (error || !dashboard) return <div className="card err" role="alert">{error || "Dashboard data is unavailable."}</div>;

  const stats = dashboard.stats;
  const performance = dashboard.performance;
  const levelProgress = Math.max(0, Math.min(100, stats.total_xp % 100));
  const progressItems = progress.map((item) => ({
    t: item.module_name,
    s: item.completed_challenges > 0 ? "done" : "active",
    sub: `${item.completed_challenges}/${item.total_challenges} challenges`,
  }));
  const displayName = dashboard.profile.full_name || dashboard.profile.username || "there";

  return <>
    <section className="hero card">
      <div className="crystal" aria-hidden="true" />
      <div>
        <span className="tag">LEVEL {stats.current_level}</span>
        <h1>Ready to level up your logic, {displayName}?</h1>
        <p className="mut">Every challenge makes you a better problem solver.</p>
        <div className="xpbar" role="progressbar" aria-label="XP to next level" aria-valuenow={levelProgress} aria-valuemin={0} aria-valuemax={100}>
          <i style={{ width: `${levelProgress}%` }} /><span>XP</span>
        </div>
        <p className="small">{levelProgress}/100 XP to level {stats.current_level + 1}</p>
        <Link className="btn" to="/arena">Continue Learning</Link>
        <Link className="btn alt" to="/arena">Enter Logic Arena</Link>
      </div>
    </section>

    <h2>Your progress</h2>
    {progressItems.length ? <IslandMap items={progressItems} /> : <div className="card mut">No progress records yet. Solve a published challenge to begin.</div>}

    <div className="grid">
      <section className="card">
        <span className="tag">YOUR XP</span>
        <h2>{stats.total_xp} XP</h2>
        <p className="mut">Level {stats.current_level}</p>
      </section>
      <section className="card">
        <h3>Challenge performance</h3>
        <div className="row">
          <div className="stat"><b>{performance.total_attempts}</b>attempts</div>
          <div className="stat"><b>{performance.correct_attempts}</b>correct</div>
          <div className="stat"><b>{performance.incorrect_attempts}</b>incorrect</div>
          <div className="stat"><b>{performance.accuracy_percentage}%</b>accuracy</div>
        </div>
        <p className="mut">Current streak: {stats.current_streak} · Longest streak: {stats.longest_streak}</p>
      </section>
    </div>

    <h2>Continue</h2>
    <div className="grid">
      <Link className="card tilt" to="/arena">Browse published challenges</Link>
      <Link className="card tilt" to="/progress">View progress</Link>
      <Link className="card tilt" to="/attempts">Review submissions</Link>
    </div>
  </>;
}
