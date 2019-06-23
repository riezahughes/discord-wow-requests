module.exports = {
  createRequest: (pool) => async (user_id, item_name, quantity) => {
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
  },

  listRequests: (pool) => async (user_id) => {
    const client = await pool.connect()

    try {
      const requestsQuery = "SELECT * FROM requests WHERE user_id = $1"
      const result = await client.query(requestsQuery, [user_id])
      return result.rows
    } catch {
      throw e
    } finally {
      client.release()
    }
  },

  depositRequest: (pool) => async (request_id, quantity) => {
    const client = await pool.connect()

    try {
      await client.query("BEGIN")
      const updateQuantity =
        "UPDATE requests SET current_quantity = current_quantity - $1 WHERE id = $2"
      const updateQuantityValues = [request_id, quantity]
      await client.query(updateQuantity, updateQuantityValues)
      await client.query("COMMIT")
    } catch (e) {
      await client.query("ROLLBACK")
      throw e
    } finally {
      client.release()
    }
  },

  deleteRequest: (pool) => async (request_id) => {
    const client = await pool.connect()

    try {
      await client.query("BEGIN")
      const deleteQuery = "DELETE FROM requests WHERE id = $1"
      const deleteQueryValues = [request_id]
      await client.query(deleteQuery, deleteQueryValues)
      await client.query("COMMIT")
    } catch (e) {
      await client.query("ROLLBACK")
      throw e
    } finally {
      client.release()
    }
  }
}
