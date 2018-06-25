const GIPHY_API_KEY = "eZzJ2ixv8CTOOE9yvR0L4x9P0IUuG8gq";

const toJson = response => response.json();

const normalize = photo => {
  return {
    id: photo.id,
    title: photo.title,
    viewLink: photo.images.original.url,
    thumbnailLink: photo.images.original.url,
    mimeType: "image/gif"
  };
};

export const all = () =>
  window
    .fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=5&rating=G&sort=relevant`
    )
    .then(toJson)
    .then(result => result.data.map(normalize));

export const search = query =>
  window
    .fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=5&rating=G&sort=relevant`
    )
    .then(toJson)
    .then(result => result.data.map(normalize));
