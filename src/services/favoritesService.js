const FAVORITES_KEY = "weather_favorites";

export const getFavorites = () => {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
};

export const addFavorite = city => {
  const favorites = getFavorites();

  if (!favorites.includes(city)) {
    const updated = [...favorites, city];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }
};

export const removeFavorite = city => {
  const favorites = getFavorites().filter(item => item !== city);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};