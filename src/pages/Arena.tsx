import { Link } from "react-router-dom";
import ChallengeBrowser from "../components/ChallengeBrowser";

export default function Arena() {
  return <>
    <h1>Logic Arena</h1>
    <p className="mut">Published challenges are validated and rewarded by the backend.</p>
    <ChallengeBrowser />
    <div className="arenabar">
      <nav className="tabs2">
        <b className="on">Challenges</b>
        <Link to="/achievements">Achievements</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  </>;
}
