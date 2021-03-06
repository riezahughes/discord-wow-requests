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
      const requestsQuery =
        "SELECT * FROM requests WHERE user_id = $1 AND fulfilled_at IS NULL"
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
      const requestsQuery = "SELECT * FROM requests ORDER BY id DESC LIMIT 25"
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
      const fulfilled = request.current_quantity === request.initial_quantity
      const to_go = request.initial_quantity - request.current_quantity
      if (fulfilled) {
        await client.query(
          "UPDATE requests SET fulfilled_at = current_timestamp WHERE id = $1",
          [request_id]
        )
      }

      await client.query("COMMIT")

      return { fulfilled, request_id: request.id, request_max: request.initial_quantity, item_name: request.item_name, user_id: request.user_id, post_id: request.post_id, to_go: to_go }
    } catch (e) {
      await client.query("ROLLBACK")
      throw e
    } finally {
      client.release()
    }
  },
  updateRequest: (pool) => async (request_id, quantity) => {
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

      const updateQuantity = `UPDATE requests SET initial_quantity = $2 WHERE id = $1`
      const updateQuantityValues = [request_id, quantity]
      await client.query(updateQuantity, updateQuantityValues)
      const updatedRequest = await client.query(
        "SELECT * FROM requests WHERE id = $1 FOR UPDATE",
        [request_id]
      )

      const request = updatedRequest.rows[0]
      const to_go = request.initial_quantity - request.current_quantity
      await client.query("COMMIT")

      return { request_id: request.id, request_max: request.initial_quantity, item_name: request.item_name, user_id: request.user_id, post_id: request.post_id, to_go: to_go }
    } catch (e) {
      await client.query("ROLLBACK")
      throw e
    } finally {
      client.release()
    }
  },
  deleteRequest: (pool) => async (request_id) => {
    const client = await pool.connect()
    //console.log("connected");
    try {
      //console.log("trycatch");
      await client.query("BEGIN")
      const existingRequest = await client.query(
        "SELECT * FROM requests WHERE id = $1",
        [request_id]
      )
      //console.log("request id:" + request_id);
      if (existingRequest.rows.length < 1) {
        throw new Error(`Request id=${request_id} does not exist`)
      }

      const deleteQuery = "DELETE FROM requests WHERE id = $1"
      const deleteQueryValues = [request_id]
      await client.query(deleteQuery, deleteQueryValues)
      await client.query("COMMIT")
      //console.log(existingRequest.rows);
      return { fulfilled: true, post_id: existingRequest.rows[0].post_id }
    } catch (e) {
      //console.log(e);
      await client.query("ROLLBACK")
      return { fulfilled: false }
      throw e
    } finally {
      client.release()
    }
  }
}
