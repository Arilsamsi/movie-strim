import { Film, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/5 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-blue-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              MovieStrim
            </span>
          </div>

          <p className="text-gray-500 text-sm text-center">
            Made with{" "}
            <Heart className="w-3 h-3 inline fill-red-500 text-red-500" /> using
            TMDB API. This product uses the TMDB API but is not endorsed or
            certified by TMDB.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              TMDB
            </a>
            <a
              href="https://github.com/arilsamsi"
              className="text-gray-500 hover:text-white transition-colors"
              target="_blank"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
