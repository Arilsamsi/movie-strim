import { motion } from "framer-motion";
import type { Genre } from "../types/tmdb";

interface Props {
  genres: Genre[];
  selected: string[];
  onToggle: (id: number) => void;
}

export default function GenreFilter({ genres, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres?.map((g) => {
        const active = selected.includes(String(g.id));

        return (
          <motion.button
            key={g.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(g.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              active
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            {g.name}
          </motion.button>
        );
      })}
    </div>
  );
}
