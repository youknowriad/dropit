const SPLASH_API_KEY =
  "37fb1728bc4d17ee3bd799a37941e9dd031e8889e0ae316a4ffc461c13b78265";

const toJson = response => response.json();

const normalize = photo => {
  return {
    id: photo.id,
    color: photo.color,
    viewLink: photo.urls.regular,
    thumbnailLink: photo.urls.small,
    downloadLink: photo.links.download_location,
    authorLink: `https://unsplash.com/@${
      photo.user.username
    }?utm_source=dropit&utm_medium=referral`,
    authorName: photo.user.name,
    siteLink: "https://unsplash.com/?utm_source=dropit&utm_medium=referral",
    siteName: "Unsplash",
    mimeType: "image/jpeg"
  };
};

export const all = (page = 1) =>
  window
    .fetch(
      `https://api.unsplash.com/photos/?client_id=${SPLASH_API_KEY}&per_page=20&page=${page}&order_by=latest`
    )
    .then(toJson)
    .then(photos => photos.map(normalize));

export const search = (search, page = 1) =>
  window
    .fetch(
      `https://api.unsplash.com/search/photos/?client_id=${SPLASH_API_KEY}&per_page=20&page=${page}&query=${search}`
    )
    .then(toJson)
    .then(data => data.results.map(normalize));

export const download = (url, name, options) =>
  window
    .fetch(`${url}?client_id=${SPLASH_API_KEY}`)
    .then(toJson)
    .then(({ url }) => {
      return new Promise(resolve => {
        const img = new window.Image();
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        img.onload = function() {
          const maxWidthHeight = 2000;
          const ratio = this.naturalWidth / this.naturalHeight;
          const width = ratio > 1 ? maxWidthHeight : maxWidthHeight * ratio;
          const height = ratio < 1 ? maxWidthHeight : maxWidthHeight / ratio;
          c.width = width;
          c.height = height;
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
          c.toBlob(resolve, "image/jpeg", 0.75);
        };
        img.crossOrigin = "";
        img.src = url;
      });
    })
    .then(blob => new window.File([blob], name + ".jpg", options));
