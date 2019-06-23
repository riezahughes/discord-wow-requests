exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns("requests", {
    post_id: { type: "text", notNull: true }
  })
}

exports.down = (pgm) => {
  pgm.dropColumns("requests", ["post_id"])
}
