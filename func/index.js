function getMeta(url) {
  let img = new Image();
  img.src = url;
  return img;
}

export default getMeta;
