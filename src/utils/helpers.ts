export const formatRating = (rating?: number) => {
  return typeof rating === "number" ? rating.toFixed(1) : "N/A";
};

export const formatRuntime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

export const formatDate = (date: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getTitle = (item: { title?: string; name?: string }) =>
  item.title || item.name || "Untitled";

export const getReleaseDate = (item: {
  release_date?: string;
  first_air_date?: string;
}) => item.release_date || item.first_air_date || "";

export const getYear = (item: {
  release_date?: string;
  first_air_date?: string;
}) => {
  const d = getReleaseDate(item);
  return d ? new Date(d).getFullYear() : "";
};
