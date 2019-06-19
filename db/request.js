module.exports = {
  createRequest: async (user_id, item_name, quantity) => {
    const client = await pool.connect()

    try {
      await client.query("BEGIN")
      const insertRequest =
        "INSERT INTO requests(user_id, item_name, quantity) VALUES ($1, $2, $3)"
      const insertRequestValues = [user_id, item_name, quantity]
      await client.query(insertRequest, insertRequestValues)
      await client.query("COMMIT")
    } catch (e) {
      await client.query("ROLLBACK")
      throw e
    } finally {
      client.release()
    }
  }
}
