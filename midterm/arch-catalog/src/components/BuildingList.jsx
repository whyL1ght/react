import BuildingCard from "./BuildingCard";

function BuildingList({ buildings, onOpen }) {
  return (
    <div className="list">
      {buildings.map((b) => (
        <BuildingCard key={b.id} building={b} onOpen={onOpen} />
      ))}
    </div>
  );
}

export default BuildingList;
