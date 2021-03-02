function iterateGrid(width, height, cb) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      cb(x, y)
    }
  }
}

module.exports = { iterateGrid }
