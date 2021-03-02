const path = require('path')
const { evolve, draw, readGrid, generateGrid } = require('./grid')

function main() {
  let grid
  let width = 50
  let height = 10
  let density = undefined

  for (let i = 0; i < process.argv.length; i++) {
    switch (process.argv[i]) {
      case '--width':
      case '-w':
        i++
        width = parseInt(process.argv[i])
        break
      case '--height':
      case '-h':
        i++
        height = parseInt(process.argv[i])
        break
      case '--density':
      case '-d':
        i++
        density = parseFloat(process.argv[i])
        break
      case '--path':
      case '-p':
        i++
        grid = readGrid(path.resolve(process.argv[i]))
        break
    }
  }

  if (!grid) {
    if (typeof width === 'number' && isNaN(width))
      throw new Error('Invalid width')
    if (typeof height === 'number' && isNaN(height))
      throw new Error('Invalid height')
    if (typeof density === 'number' && isNaN(density))
      throw new Error('Invalid density')

    grid = generateGrid(width, height, density)
  }

  draw(grid)
  setInterval(() => {
    evolve(grid)
    draw(grid)
  }, 1000)
}
main()
