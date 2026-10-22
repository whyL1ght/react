import { useState, useEffect } from "react";
import {
  getItemsList,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "./api/fakeApi";
import ItemList from "./components/ItemList";
import ItemDetails from "./components/ItemDetails";
import ItemForm from "./components/ItemForm";

const emptyItem = {
  name: "",
  description: "",
  author: "",
  year: "",
  genre: "",
  pages: "",
  rating: "",
  status: "available",
};

function App() {
  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [detailsReload, setDetailsReload] = useState(0);

  const [formMode, setFormMode] = useState(null); 
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    setListLoading(true);
    setListError("");

    getItemsList("?limit=100")
      .then((result) => {
        if (!ignore) {
          setItems(result.data);
          setListLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setListError(err.message);
          setListLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadCount]);

  useEffect(() => {
    if (selectedId === null) {
      setDetails(null);
      setDetailsError("");
      setDetailsLoading(false);
      return;
    }

    let ignore = false;

    setDetails(null);
    setDetailsLoading(true);
    setDetailsError("");

    getItem(selectedId)
      .then((item) => {
        if (!ignore) {
          setDetails(item);
          setDetailsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setDetailsError(err.message);
          setDetailsLoading(false);
        }
      });


    return () => {
      ignore = true;
    };
  }, [selectedId, detailsReload]);

  function handleSelect(id) {
    setFormMode(null);
    setMessage("");
    setSelectedId(id);
  }

  async function handleToggleStatus() {
    const id = details.id; 
    const newStatus = details.status === "available" ? "borrowed" : "available";

    setActionId(id);
    setMessage("");

    try {
      await updateItem(id, { status: newStatus });

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      setDetails((prev) =>
        prev && prev.id === id ? { ...prev, status: newStatus } : prev
      );
      setMessage("Status updated");
    } catch (err) {
      setMessage("Error: " + err.message);
    }

    setActionId(null);
  }

  async function handleDelete() {
    const id = details.id;

    if (!window.confirm("Delete this book?")) {
      return;
    }

    setActionId(id);
    setMessage("");

    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedId((prev) => (prev === id ? null : prev));
      setMessage("Book deleted");
    } catch (err) {
      setMessage("Error: " + err.message);
    }

    setActionId(null);
  }

  async function handleSave(data) {
    if (formMode === "create") {
      setActionId("new");
      try {
        const created = await createItem({
          name: data.name,
          description: data.description,
        });
        const id = created.id;

        setItems((prev) => [...prev, created]);

        try {
          const full = await updateItem(id, data);
          setItems((prev) =>
            prev.map((item) => (item.id === id ? full : item))
          );
          setMessage("Book added");
        } catch (err) {
          setMessage(
            "Book created, but some fields were not saved. Open it, click Edit and save again"
          );
        }

        setFormMode(null);
      } finally {
        setActionId(null);
      }
    } else {
      const id = details.id;
      setActionId(id);
      try {
        await updateItem(id, data);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...data } : item))
        );
        setDetails((prev) =>
          prev && prev.id === id ? { ...prev, ...data } : prev
        );
        setFormMode(null);
        setMessage("Book updated");
      } finally {
        setActionId(null);
      }
    }
  }

  return (
    <div className="app">
      <h1>Library</h1>

      {message && <p className="message">{message}</p>}

      <div className="layout">
        <ItemList
          items={items}
          loading={listLoading}
          error={listError}
          selectedId={selectedId}
          disabled={actionId !== null}
          onSelect={handleSelect}
          onReload={() => setReloadCount(reloadCount + 1)}
          onCreate={() => {
            setSelectedId(null);
            setMessage("");
            setFormMode("create");
          }}
        />

        <div className="panel">
          {formMode !== null ? (
            <ItemForm
              key={formMode + (details ? details.id : "")}
              initialValues={formMode === "edit" ? details : emptyItem}
              title={formMode === "edit" ? "Edit book" : "New book"}
              disabled={actionId !== null}
              onSave={handleSave}
              onCancel={() => setFormMode(null)}
            />
          ) : (
            <ItemDetails
              selectedId={selectedId}
              details={details}
              loading={detailsLoading}
              error={detailsError}
              busy={actionId !== null}
              onRetry={() => setDetailsReload(detailsReload + 1)}
              onToggleStatus={handleToggleStatus}
              onEdit={() => setFormMode("edit")}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;