module.exports = {
  createRequest: (pool) => async (user_id, post_id, item_name, quantity) => {
    const client = await pool.connect()

    try {
      await client.query("BEGIN")
      const insertRequest = `INSERT INTO requests(user_id, post_id, item_name, initial_quantity, current_quantity) 
          VALUES ($1, $2, $3, $4, $5) RETURNING id`
      const insertRequestValues = [user_id, post_id, item_name, quantity, 0]
      const result = await client.query(insertRequest, insertRequestValues)
      await client.query("COMMIT")
      return result.rows
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

  listAllRequests: (pool) => async () => {
    const client = await pool.connect()

    try {
      const requestsQuery = "SELECT * FROM requests"
      const result = await client.query(requestsQuery)
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
      const existsingRequest = await client.query(
        "SELECT * FROM requests WHERE id = $1 FOR UPDATE",
        [request_id]
      )

      if (existsingRequest.rows.length < 1) {
        throw new Error(`Request id=${request_id} does not exist`)
      }

      const updateQuantity = `UPDATE requests SET current_quantity = (
          CASE WHEN current_quantity + $2 <= initial_quantity
          THEN (current_quantity + $2) 
          ELSE initial_quantity END
        ) WHERE id = $1`
      const updateQuantityValues = [request_id, quantity]
      await client.query(updateQuantity, updateQuantityValues)
      const updatedRequest = await client.query(
        "SELECT * FROM requests WHERE id = $1 FOR UPDATE",
        [request_id]
      )

      const request = updatedRequest.rows[0]
      if (request.current_quantity === request.initial_quantity) {
        await client.query(
          "UPDATE requests SET fulfilled_at = current_timestamp WHERE id = $1",
          [request_id]
        )
      }

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
