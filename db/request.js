module.exports = {
  createRequest: pool => async (user_id, item_name, quantity) => {
    const client = await pool.connect()

    try {
      await client.query("BEGIN")
      const insertRequest =
        "INSERT INTO requests(user_id, item_name, intial_quantity, current_quantity) VALUES ($1, $2, $3, $4)"
      const insertRequestValues = [user_id, item_name, quantity, quantity]
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
