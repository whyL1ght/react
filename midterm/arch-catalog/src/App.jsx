import { useState, useEffect } from "react";
import { getBuildings } from "./api";
import Filters from "./components/Filters";
import BuildingList from "./components/BuildingList";
import BuildingDetails from "./components/BuildingDetails";
import AddBuildingForm from "./components/AddBuildingForm";
import Pagination from "./components/Pagination";
import Message from "./components/Message";

const PER_PAGE = 12;

function App() {
  const [buildings, setBuildings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [style, setStyle] = useState("all");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false; 
    setLoading(true);
    setError("");

    getBuildings({ search, style, sort, page, perPage: PER_PAGE })
      .then((data) => {
        if (!ignore) {
          setBuildings(data.items);
          setTotal(data.total);
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
  }, [search, style, sort, page, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleStyle(value) {
    setStyle(value);
    setPage(1);
  }

  function handleSort(value) {
    setSort(value);
    setPage(1);
  }

  function handleReset() {
    setSearch("");
    setStyle("all");
    setSort("name");
    setPage(1);
    setSuccess("");
  }

  function handleAdded() {
    setShowForm(false);
    setSearch("");
    setStyle("all");
    setSort("name");
    setPage(1);
    setSuccess("Building added successfully.");
    setReloadKey(reloadKey + 1);
  }

  return (
    <div className="app">
      <header>
        <div className="header-copy">
          <p className="eyebrow">A visual archive of place</p>
          <h1>Architecture<br />Catalog</h1>
          <p className="header-subtitle">Heritage buildings for measured drawing study</p>
        </div>
        <div className="header-shape" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </header>

      {selectedId ? (
        <BuildingDetails
          key={selectedId}
          id={selectedId}
          onBack={() => setSelectedId(null)}
        />
      ) : showForm ? (
        <AddBuildingForm
          onAdded={handleAdded}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <main>
          <div className="top-row">
            <div>
              <p className="section-kicker">Collection / 2026</p>
              <h2>Explore the archive</h2>
              <p className="result-count"><strong>{total}</strong> buildings found</p>
            </div>
            <button className="primary-action" onClick={() => setShowForm(true)}>
              <span>+</span> Add building
            </button>
          </div>

          <Filters
            search={search}
            style={style}
            sort={sort}
            onSearch={handleSearch}
            onStyle={handleStyle}
            onSort={handleSort}
            onReset={handleReset}
          />

          {success && <Message type="success" text={success} />}

          {loading && <Message type="loading" text="Loading buildings..." />}

          {error && (
            <Message
              type="error"
              text={error}
              onRetry={() => setReloadKey(reloadKey + 1)}
            />
          )}

          {!loading && !error && buildings.length === 0 && (
            <Message type="empty" text="No buildings match your search." />
          )}

          {!loading && !error && buildings.length > 0 && (
            <div>
              <BuildingList buildings={buildings} onOpen={setSelectedId} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
