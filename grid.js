const { iterateGrid } = require('./util')
const fs = require('fs')

function generateGrid(width, height, density = 0.1) {
  const grid = { width, height, cells: {} }
  iterateGrid(width, height, (x, y) => {
    if (Math.random() < density) {
      grid.cells[y * width + x] = 1
    }
  })
  return grid
}

function readGrid(path) {
  const grid = { cells: {} }
  const lines = fs.readFileSync(path).toString('utf8').split('\n')
  grid.height = lines.length
  grid.width = lines[0].length

  // Validation
  if (
    !lines.length ||
    lines.some((x) => x.length !== grid.width || !/^[01]+$/.test(x))
  ) {
    throw new Error(
      `Grid must be a set of lines of equal widths containing only '0's and '1's`
    )
  }

  // Formatting
  iterateGrid(grid.width, grid.height, (x, y) => {
    if (lines[y][x] === '1') {
      grid.cells[y * grid.width + x] = 1
    }
  })
  return grid
}

function getNeighbors(grid) {
  const neighbors = {}

  iterateGrid(grid.width, grid.height, (x, y) => {
    if (!grid.cells[y * grid.width + x]) return

    for (let i = -1; i <= +1; i++) {
      for (let j = -1; j <= +1; j++) {
        if (
          // Check if indices are valid
          y + i >= 0 &&
          x + j >= 0 &&
          y + i < grid.height &&
          x + j < grid.width &&
          // Cell is not a neighbor of itself
          (i !== 0 || j !== 0)
        ) {
          const position = (y + i) * grid.width + (x + j)

          neighbors[position] ||= 0
          ++neighbors[position]
        }
      }
    }
  })

  return neighbors
}

function evolve(grid) {
  const { width, cells } = grid
  const newCells = {}
  const neighbors = getNeighbors(grid)

  iterateGrid(grid.width, grid.height, (x, y) => {
    const position = y * width + x
    const nb = neighbors[position] || 0

    if (nb === 3 || (cells[position] && nb === 2)) {
      newCells[position] = 1
    }
  })
  grid.cells = newCells
}

function draw(grid) {
  console.log('-'.repeat(grid.width))
  for (let y = 0; y < grid.height; y++) {
    let line = ''
    for (let x = 0; x < grid.width; x++) {
      line += grid.cells[y * grid.width + x] ? '■' : '□'
    }
    console.log(line)
  }
}

module.exports = { generateGrid, readGrid, evolve, draw }
