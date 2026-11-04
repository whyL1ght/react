import { useEffect, useState } from "react";
import { fetchGames } from "../services/service";

export function useGames(query) {
  const [state, setState] = useState({ data: [], loading: true, error: "" });

  useEffect(() => {
    let active = true;
    setState({ data: [], loading: true, error: "" });

    fetchGames(query)
      .then((result) => {
        if (active) setState({ ...result, loading: false, error: "" });
      })
      .catch((error) => {
        if (active) setState({ data: [], loading: false, error: error.message });
      });

    return () => {
      active = false;
    };
  }, [query]);

  return state;
}
