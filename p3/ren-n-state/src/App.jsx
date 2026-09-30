import { useState } from "react";
import CrewCard from "./CrewCard.jsx";

const STATUSES = ["duty", "rest", "mission"];
const MODULES = { Commander: "Bridge", Engineer: "Engine room", Doctor: "Medbay", Scientist: "Lab", Pilot: "Dock" };

const START_CREW = [
  { id: 1, name: "Toleutayev Alisher", role: "Commander", module: "Bridge", status: "duty", resetCount: 0 },
  { id: 2, name: "Karimov Dias", role: "Engineer", module: "Engine room", status: "duty", resetCount: 0 },
  { id: 3, name: "Temirgaliyev Samat", role: "Doctor", module: "Medbay", status: "rest", resetCount: 0 },
  { id: 4, name: "Adilbekov Adil", role: "Pilot", module: "Dock", status: "mission", resetCount: 0 },
];

export default function App() {
  const [crew, setCrew] = useState(START_CREW);
  const [filter, setFilter] = useState("all");
  const [reversed, setReversed] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Engineer");
  const [nextId, setNextId] = useState(5);

  console.log("App rendered");

  function addMember(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setCrew([...crew, { id: nextId, name: name.trim(), role, module: MODULES[role], status: "rest", resetCount: 0 }]);
    setNextId(nextId + 1);
    setName("");
  }

  function removeMember(id) {
    setCrew(crew.filter((m) => m.id !== id));
  }

  function changeStatus(id, status) {
    setCrew(crew.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  function resetMember(id) {
    setCrew(crew.map((m) => (m.id === id ? { ...m, resetCount: m.resetCount + 1 } : m)));
  }

  const ordered = reversed ? [...crew].reverse() : crew;
  const matches = (m) => filter === "all" || m.status === filter;
  const shownCount = crew.filter(matches).length;
  const onDuty = crew.filter((m) => m.status === "duty").length;

  return (
    <div className="page">
      <header className="top">
        <h1>Space Station Crew</h1>
        <p className="count">On duty: <strong>{onDuty}</strong> / {crew.length}</p>
      </header>

      <form className="add" onSubmit={addMember}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New crew member name" />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {Object.keys(MODULES).map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <button type="submit">Add to crew</button>
      </form>

      <div className="tools">
        <div className="filters">
          {["all", ...STATUSES].map((f) => (
            <button key={f} className={filter === f ? "chip on" : "chip"} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <button className="chip" onClick={() => setReversed(!reversed)}>
          Reverse order
        </button>
      </div>

      {shownCount === 0 && (
        <p className="empty">Nobody here. Add a crew member or change the filter.</p>
      )}

      <ul className="list">
        {ordered.map((m) => (
          <CrewCard
            key={m.id + "-" + m.resetCount}
            member={m}
            hidden={!matches(m)}
            statuses={STATUSES}
            onStatus={changeStatus}
            onRemove={removeMember}
            onReset={resetMember}
          />
        ))}
      </ul>
    </div>
  );
}