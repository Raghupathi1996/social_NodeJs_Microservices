## README



## Service Down moderation
- **Option 1:** **Synchronous approch** where the service contacts the post and the comment serivies directly. And perform its operation and updates the query service and futher goes on with async approach.
- **Option 2: Direct DB Access** the Query and moderation services direct access to post data store and comment store. Drawback is various services can have different DBs.
- **Option 3: Store Events in the Event Bus** then the moderation and the query service can fetch all the events emitted when both the services where offline. Then once they come online fetch the events stored in the event bus data store.