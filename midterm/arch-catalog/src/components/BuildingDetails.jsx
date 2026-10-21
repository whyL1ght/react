import { useState, useEffect } from "react";
import { getBuilding } from "../api";
import Message from "./Message";
import { flags, styleClass } from "../data";

function BuildingDetails({ id, onBack }) {
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    getBuilding(id)
      .then((data) => {
        if (!ignore) {
          setBuilding(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className="details">
      <button onClick={onBack}>Back to list</button>

      {loading && <Message type="loading" text="Loading building..." />}
      {error && <Message type="error" text={error} />}

      {building && !loading && (
        <div>
          <div className="flag-big">{flags[building.city] || "🏛️"}</div>
          <h2>{building.name}</h2>
          <span className={styleClass(building.style)}>{building.style}</span>
          <p>City: {building.city}</p>
          <p>Year built: {building.year}</p>
          <p>{building.description}</p>
        </div>
      )}
    </div>
  );
}

export default BuildingDetails;
