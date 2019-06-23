exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.renameColumn("requests", "intial_quantity", "initial_quantity")
}

exports.down = (pgm) => {
  pgm.renameColumn("requests", "initial_quantity", "intial_quantity")
}
