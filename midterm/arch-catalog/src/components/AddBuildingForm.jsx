import { useState } from "react";
import { addBuilding } from "../api";
import { styles } from "../data";

const emptyForm = {
  name: "",
  city: "",
  style: styles[0],
  year: "",
  description: "",
};

function AddBuildingForm({ onAdded, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.name.trim() === "" || form.city.trim() === "") {
      setError("Name and city are required");
      return;
    }
    if (Number(form.year) < 1 || Number(form.year) > 2026) {
      setError("Year must be between 1 and 2026");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await addBuilding(form);
      setForm(emptyForm);
      onAdded();
    } catch (err) {
      setError("Could not save the building");
    }
    setSaving(false);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add a building</h2>

      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} />
      </label>

      <label>
        City
        <input name="city" value={form.city} onChange={handleChange} />
      </label>

      <label>
        Style
        <select name="style" value={form.style} onChange={handleChange}>
          {styles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label>
        Year built
        <input
          name="year"
          type="number"
          value={form.year}
          onChange={handleChange}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <div className="form-buttons">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save building"}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddBuildingForm;
