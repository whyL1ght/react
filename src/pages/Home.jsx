import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Welcome to Pixel Quest</p>
        <h1>
          Games for
          <br />
          <span>new adventures.</span>
        </h1>
        <p className="lead">
          A small video game catalog with search, filters, and details for every
          game.
        </p>
        <div className="hero-actions">
          <Link className="button" to="/games">
            Browse games
          </Link>
          <Link className="button secondary" to="/about">
            About the project
          </Link>
        </div>
      </div>
      <img
        className="hero-image compact-image"
        src={`${import.meta.env.BASE_URL}controller.svg`}
        alt="Game controller"
      />
    </section>
  );
}
