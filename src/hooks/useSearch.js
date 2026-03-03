import { useMemo } from "react";
import EPISODES from "../data/episodes.json";
import GLOSSARY from "../data/glossary.json";
import PLATFORMS from "../data/platforms.json";
import TOOLS from "../data/tools.json";

export function useSearch(query) {
  return useMemo(() => {
    if (!query || query.length < 2)
      return { episodes: [], glossary: [], platforms: [], tools: [] };

    const q = query.toLowerCase();
    const match = (str) => str.toLowerCase().includes(q);

    return {
      episodes: EPISODES.filter(
        (e) => match(e.title) || match(e.description) || e.tags.some((t) => match(t))
      ),
      glossary: GLOSSARY.filter(
        (g) => match(g.term) || match(g.definition) || match(g.category)
      ),
      platforms: PLATFORMS.filter(
        (p) =>
          match(p.name) ||
          match(p.description) ||
          p.tags.some((t) => match(t)) ||
          match(p.category)
      ),
      tools: TOOLS.filter(
        (tl) => match(tl.name) || match(tl.useCase) || match(tl.category)
      ),
    };
  }, [query]);
}
