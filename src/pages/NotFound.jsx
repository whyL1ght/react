import { Link } from "react-router-dom";

export default function NotFound() {
  return <section className="empty-page"><div>404</div><h1>This page does not exist</h1><p>It looks like this level has not been created yet.</p><Link className="button" to="/">Go home</Link></section>;
}
