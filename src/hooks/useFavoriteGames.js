import { useEffect, useState } from "react";
import { fetchFavoriteGames } from "../services/favoritesService";
import { FAVORITES_EVENT } from "./useFavorites";

export function useFavoriteGames(uid) {
  const [state, setState] = useState({ data: [], loading: true, error: "" });

  useEffect(() => {
    if (!uid) return;
    let active = true;
    setState({ data: [], loading: true, error: "" });

    function load() {
      fetchFavoriteGames(uid)
        .then((data) => {
          if (active) setState({ data, loading: false, error: "" });
        })
        .catch((error) => {
          if (active)
            setState({ data: [], loading: false, error: error.message });
        });
    }

    load();
    // Reload the list when the user adds or removes a favorite
    window.addEventListener(FAVORITES_EVENT, load);
    return () => {
      active = false;
      window.removeEventListener(FAVORITES_EVENT, load);
    };
  }, [uid]);

  return state;
}
