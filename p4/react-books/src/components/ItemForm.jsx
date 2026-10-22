import { useState } from "react";

function ItemForm({ initialValues, title, disabled, onSave, onCancel }) {
  const [values, setValues] = useState({
    name: initialValues.name || "",
    description: initialValues.description || "",
    author: initialValues.author || "",
    year: initialValues.year || "",
    genre: initialValues.genre || "",
    pages: initialValues.pages || "",
    rating: initialValues.rating || "",
    status: initialValues.status || "available",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (values.name.trim() === "") {
      setError("Title cannot be empty");
      return;
    }

    setError("");

    const data = {
      ...values,
      year: values.year === "" ? "" : Number(values.year),
      pages: values.pages === "" ? "" : Number(values.pages),
      rating: values.rating === "" ? "" : Number(values.rating),
    };

    try {
      await onSave(data);
    } catch (err) {
      setError("Error: " + err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>{title}</h2>

      <label>
        Title
        <input name="name" value={values.name} onChange={handleChange} />
      </label>
      <label>
        Description
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Author
        <input name="author" value={values.author} onChange={handleChange} />
      </label>
      <label>
        Year
        <input
          name="year"
          type="number"
          value={values.year}
          onChange={handleChange}
        />
      </label>
      <label>
        Genre
        <input name="genre" value={values.genre} onChange={handleChange} />
      </label>
      <label>
        Pages
        <input
          name="pages"
          type="number"
          value={values.pages}
          onChange={handleChange}
        />
      </label>
      <label>
        Rating (0–10)
        <input
          name="rating"
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={values.rating}
          onChange={handleChange}
        />
      </label>
      <label>
        Status
        <select name="status" value={values.status} onChange={handleChange}>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <div className="toolbar">
        <button type="submit" disabled={disabled}>
          {disabled ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={disabled}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ItemForm;