exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns("requests", {
    fulfilled_at: { type: "timestamp" }
  })
}

exports.down = (pgm) => {
  pgm.dropColumns("requests", ["fulfilled_at"])
}
