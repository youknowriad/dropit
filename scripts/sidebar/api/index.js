const clientId =
  "37fb1728bc4d17ee3bd799a37941e9dd031e8889e0ae316a4ffc461c13b78265";

const toJson = response => response.json();

export const getPhotos = (page = 1) =>
  window
    .fetch(
      `https://api.unsplash.com/photos/?client_id=${clientId}&per_page=20&page=${page}&order_by=latest`
    )
    .then(toJson);

export const searchPhotos = (search, page = 1) =>
  window
    .fetch(
      `https://api.unsplash.com/search/photos/?client_id=${clientId}&per_page=20&page=${page}&query=${search}`
    )
    .then(toJson);
