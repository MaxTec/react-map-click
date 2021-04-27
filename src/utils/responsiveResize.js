const cARatio = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
};
export { cARatio };
