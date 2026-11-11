import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGame } from "../services/service";

export default function CreateGame() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    genre: "Adventure",
    platform: "PC",
    rating: "5",
    year: "2024",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const game = await createGame({
        ...form,
        rating: Number(form.rating),
        year: Number(form.year),
      });
      navigate(`/games/${game.id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <p className="eyebrow">Catalog</p>
      <h1>Add game</h1>
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          required
        />
      </label>
      <label>
        Genre
        <select name="genre" value={form.genre} onChange={handleChange}>
          <option>Adventure</option>
          <option>Racing</option>
          <option>Strategy</option>
          <option>Simulator</option>
          <option>Mystery</option>
        </select>
      </label>
      <label>
        Platform
        <select name="platform" value={form.platform} onChange={handleChange}>
          <option>PC</option>
          <option>PlayStation</option>
          <option>Xbox</option>
          <option>Nintendo</option>
        </select>
      </label>
      <label>
        Rating (0-10)
        <input
          type="number"
          name="rating"
          min="0"
          max="10"
          step="0.1"
          value={form.rating}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Year
        <input
          type="number"
          name="year"
          min="1970"
          max="2100"
          value={form.year}
          onChange={handleChange}
          required
        />
      </label>
      {error && <p className="state error">{error}</p>}
      <button className="button" type="submit" disabled={saving}>
        {saving ? "Saving..." : "Add game"}
      </button>
    </form>
  );
}
