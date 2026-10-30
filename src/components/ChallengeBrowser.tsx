import { useEffect, useState, type FormEvent } from "react";
import {
  getChallenge,
  getChallenges,
  submitChallenge,
  type Challenge,
  type ChallengeSubmission,
} from "../services/api";
import { useAuth } from "../auth/useAuth";

export default function ChallengeBrowser({ category }: { category?: string }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [submission, setSubmission] = useState<ChallengeSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { updateStats } = useAuth();

  useEffect(() => {
    let active = true;
    getChallenges()
      .then((items) => {
        if (active) setChallenges(items);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load challenges.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const shown = category
    ? challenges.filter((challenge) => challenge.category.toLowerCase().includes(category.toLowerCase()))
    : challenges;

  async function selectChallenge(challenge: Challenge) {
    setError("");
    setSubmission(null);
    setAnswer("");
    setDetailLoading(true);
    try {
      setSelected(await getChallenge(challenge.id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load challenge.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setError("");
    setSubmission(null);
    setSubmitting(true);
    try {
      const response = await submitChallenge(selected.id, answer);
      setSubmission(response.result);
      updateStats({
        total_xp: response.result.total_xp,
        current_level: response.result.current_level,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit your answer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="card" role="status">Loading challenges...</div>;
  if (error && challenges.length === 0) return <div className="card err" role="alert">{error}</div>;

  return (
    <section>
      {error && <p className="card err" role="alert">{error}</p>}
      {selected ? (
        <div className="card">
          <button type="button" className="ghost" onClick={() => { setSelected(null); setSubmission(null); setError(""); }}>← Challenges</button>
          {detailLoading ? <p role="status">Loading challenge...</p> : <>
            <p className="tag">{selected.category} · {selected.difficulty}</p>
            <h2>{selected.title}</h2>
            <p className="mut">{selected.description}</p>
            <p className="small">First correct solve awards XP according to the backend challenge rules.</p>
            <form onSubmit={handleSubmit}>
              <label>Answer<br />
                <textarea className="answer-input" required value={answer} onChange={(event) => setAnswer(event.target.value)} />
              </label>
              <br />
              <button className="btn" disabled={submitting || !answer.trim()}>{submitting ? "Submitting..." : "Submit answer"}</button>
            </form>
            {submission && (
              <div className={submission.is_correct ? "submission correct" : "submission incorrect"} role="status">
                <b>{submission.is_correct ? "Correct answer" : "Not correct yet"}</b>
                <p>{submission.xp_earned > 0 ? `+${submission.xp_earned} XP earned.` : "No new challenge XP earned for this submission."}</p>
                {submission.already_rewarded && <p>This challenge reward was already claimed.</p>}
                <p>Total: {submission.total_xp} XP · Level {submission.current_level}</p>
              </div>
            )}
          </>}
        </div>
      ) : shown.length ? (
        <div className="grid">
          {shown.map((challenge) => (
            <button type="button" className="card challenge-card" key={challenge.id} onClick={() => void selectChallenge(challenge)}>
              <span className="tag">{challenge.difficulty} · {challenge.category}</span>
              <h3>{challenge.title}</h3>
              <span className="mut">{challenge.description}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="card">
          <p>{category ? `No published ${category} challenges are available.` : "No published challenges are available."}</p>
          {category && <p className="small">Try the Logic Arena to browse all available challenges.</p>}
        </div>
      )}
    </section>
  );
}
