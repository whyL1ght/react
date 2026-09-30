import { useState } from "react";

export default function CrewCard({ member, hidden, statuses, onStatus, onRemove, onReset }) {
  const [oxygen, setOxygen] = useState(100);
  const [note, setNote] = useState("");

  console.log("CrewCard rendered:", member.name);

  if (hidden) return null;

  return (
    <li className={"card " + member.status}>
      <div className="row">
        <h2>{member.name}</h2>
        <span className="tag">{member.role}</span>
      </div>

      <p className="meta">Module: {member.module}</p>

      <div className="status">
        {statuses.map((s) => (
          <button key={s} className={member.status === s ? "chip on" : "chip"} onClick={() => onStatus(member.id, s)}>
            {s}
          </button>
        ))}
      </div>

      <label className="oxygen">
        Oxygen: <strong>{oxygen}%</strong>
        <input type="range" min="0" max="100" value={oxygen} onChange={(e) => setOxygen(Number(e.target.value))} />
      </label>

      <input className="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Your note" />

      {oxygen < 30 && <p className="warning">Low oxygen! Send this person to rest.</p>}

      <div className="actions">
        <button className="link" onClick={() => onReset(member.id)}>Reset suit</button>
        <button className="link danger" onClick={() => onRemove(member.id)}>Remove</button>
      </div>
    </li>
  );
}