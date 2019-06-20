exports.up = pgm => {
  pgm.createTable("requests", {
    id: "id",
    user_id: { type: "bigint", notNull: true },
    item_name: { type: "text", notNull: true },
    quantity: { type: "integer", notNull: true },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  })
  pgm.createIndex("requests", "user_id")
  pgm.createIndex("requests", "item_name")
}
