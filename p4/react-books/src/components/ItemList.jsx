function ItemList({
  items,
  loading,
  error,
  selectedId,
  disabled,
  onSelect,
  onReload,
  onCreate,
}) {
  return (
    <div className="panel">
      <div className="toolbar">
        <button onClick={onReload} disabled={loading}>
          Reload
        </button>
        <button onClick={onCreate} disabled={disabled}>
          + Add
        </button>
      </div>

      {loading && <p>Loading list...</p>}

      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={onReload}>Try again</button>
        </div>
      )}

      {!loading && !error && items.length === 0 && <p>The list is empty</p>}

      {!loading && !error && items.length > 0 && (
        <ul className="list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                className={item.id === selectedId ? "item active" : "item"}
                onClick={() => onSelect(item.id)}
                disabled={disabled}
              >
                <span>{item.name}</span>
                <small>
                  {item.status === "borrowed" ? "borrowed" : "available"}
                </small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;