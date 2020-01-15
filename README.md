# Discord WoW Requests

How it works:

- User makes a request
- A Channel is chosen to post these requests
- The bot keeps track of how much is left of each request
- All users can deposit items to the request
- The post is kept updated in realtime
- When the request is finished, it is removed from the board and the User who posted is notified. 

This was a joint project with @sashman


## Usage

### Database

Create database:

```
PGDATABASE=discord_wow_request PGUSER=postgres PGPASSWORD=postgres npm run create_db
```

Run migrations:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/discord_wow_request npm run migrate up
```
