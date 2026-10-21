import { flags, styleClass } from "../data";

function BuildingCard({ building, onOpen }) {
  return (
    <div className="card" onClick={() => onOpen(building.id)}>
      <div className="flag">{flags[building.city] || "🏛️"}</div>
      <div className="card-text">
        <h3>{building.name}</h3>
        <p>{building.city}</p>
        <div className="card-bottom">
          <span className={styleClass(building.style)}>{building.style}</span>
          <span className="year">{building.year}</span>
        </div>
      </div>
    </div>
  );
}

export default BuildingCard;
