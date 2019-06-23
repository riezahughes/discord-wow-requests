exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.renameColumn("requests", "createdAt", "created_at")
}

exports.down = (pgm) => {
  pgm.renameColumn("requests", "created_at", "createdAt")
}
