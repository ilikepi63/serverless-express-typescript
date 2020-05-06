import * as serverless  from "serverless-http";
import express          from "express";

// instantiate the express app here
const app = express()
 
/** Get users with specific constraints
 * 
 */
app.get('/user', function ( req:express.Request, res:express.Response ) {

  res.send('You just got a list of users')

});

/** Get an user with a specific id
 * 
 *  @param id - ID of the user 
 */
app.get('/user/:userId', ( req:express.Request, res:express.Response )  => {
  const { id } = req.params

  console.log(id);

  res.send("You just retrieved a user using an id ")
})

/** Create a new user
 * 
 */
app.post("/user", ( req:express.Request, res:express.Response ) => {
  res.send('you just added a user');
});

/** Update a user  
 * 
 *  @param id - ID of the user 
 */
app.put("/user/:id", ( req:express.Request, res:express.Response ) => {
  const { id } = req.params

  res.send("You just updated a user");
});

/** Delete a user 
 * 
 *  @param id - ID of the user 
 */
app.delete("/user/:id", ( req:express.Request, res:express.Response ) => {
  const { id } = req.params

  res.send("You just deleted a user");
});

export const hello = serverless(app);