function show(value) {
  return value === undefined || value === "" ? "—" : value;
}

function ItemDetails({
  selectedId,
  details,
  loading,
  error,
  busy,
  onRetry,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  if (selectedId === null) {
    return <p>Select a book from the list</p>;
  }

  if (loading) {
    return <p>Loading details...</p>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={onRetry}>Try again</button>
      </div>
    );
  }

  if (!details) {
    return null;
  }

  return (
    <div>
      <h2>{details.name}</h2>

      <dl className="fields">
        <dt>ID</dt>
        <dd>{details.id}</dd>
        <dt>Description</dt>
        <dd>{show(details.description)}</dd>
        <dt>Author</dt>
        <dd>{show(details.author)}</dd>
        <dt>Year</dt>
        <dd>{show(details.year)}</dd>
        <dt>Genre</dt>
        <dd>{show(details.genre)}</dd>
        <dt>Pages</dt>
        <dd>{show(details.pages)}</dd>
        <dt>Rating</dt>
        <dd>{show(details.rating)}</dd>
        <dt>Status</dt>
        <dd>{details.status === "borrowed" ? "Borrowed" : "Available"}</dd>
      </dl>

      {busy && <p>Action in progress...</p>}

      <div className="toolbar">
        <button onClick={onToggleStatus} disabled={busy}>
          {details.status === "borrowed" ? "Return to library" : "Lend out"}
        </button>
        <button onClick={onEdit} disabled={busy}>
          Edit
        </button>
        <button onClick={onDelete} disabled={busy}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ItemDetails;