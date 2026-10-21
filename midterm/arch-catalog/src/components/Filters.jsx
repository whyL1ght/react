import { styles } from "../data";

function Filters({ search, style, sort, onSearch, onStyle, onSort, onReset }) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by name or city"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <select value={style} onChange={(e) => onStyle(e.target.value)}>
        <option value="all">All styles</option>
        {styles.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select value={sort} onChange={(e) => onSort(e.target.value)}>
        <option value="name">Name A-Z</option>
        <option value="oldest">Oldest first</option>
        <option value="newest">Newest first</option>
      </select>

      <button onClick={onReset}>Reset</button>
    </div>
  );
}

export default Filters;
