import * as serverless  from "serverless-http";
import express          from "express";
import bodyParser       from "body-parser";
import * as aws         from "aws-sdk";
import User             from "./models/user";
import db               from "./db/db";


// instantiate the express app here
const app = express()

// object for database operations
const dbOperator = db();

// get the USER_TABLES from the environment variables
const { USERS_TABLE } = process.env;

// use body parser to interpret body data from express request object
app.use( bodyParser.json( { strict: false } ) );

/** Get users with specific constraints
 * 
 */
app.get('/user', function ( req:express.Request, res:express.Response ) {

  const params = {
    TableName: USERS_TABLE,
    // TODO: add filters in the query param -> req.params
    // FilterExpression : 'name = :surname',
    // ExpressionAttributeValues : {':surname' : "cameron"}
  };
  
  // do the database operation 
  dbOperator.invoke( params, "scan" )
       .then((result => {

          // return the data as json to the client
          res.json(result);
       }))
       .catch( (err) => {
            res.status(400).json({ error: err ? err : "Could not get any users" })
            return; 
       });

});

/** Get an user with a specific id
 * 
 *  @param id - ID of the user 
 */
app.get('/user/:id', ( req:express.Request, res:express.Response )  => {

  // create the params 
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.id,
    },
  }

  // do the database operation 
  dbOperator.invoke( params, "get" )
       .then((result => {
          // if an item was returned, then send it back 
          const {userId, name, surname} = result.Item;

          // return the data as json to the client
          res.json({ userId, name, surname });
       }))
       .catch( (err) => {
            res.status(400).json({ error: err ? err : "Could not get the user" })
            return; 
       });

})

/** Create a new user
 * 
 */
app.post("/user", ( req:express.Request, res:express.Response ) => {

  // first will need to parse the json 
  var parsedBody;

  try{
    parsedBody = JSON.parse(req.body);
  }catch(e){
    res.status(400).json({ error: `Parameter id must be a string. Value: ${req.body}` });
  }

  // deconstruct the body to get the user data
  const user: User = User.fromJson( parsedBody );

  // validate the user 
  if( !user.validate() ){
    res.status(400).json({ error: user.error });
    return;
  }

  // convert the user back to json
  const userJson = user.toJson();
        
  // create the params
  const params = {
    TableName: USERS_TABLE,
    Item: userJson,
  };

  // do the database operation 
  dbOperator.invoke( params, "put" )
    .then((result => {
      // return the data as json to the client
      res.json( userJson );
    }))
    .catch( (err) => {
        res.status(400).json({ error: err ? err : "Could not add user" })
        return; 
    });
    
});

/** Update a user  
 * 
 *  @param id - ID of the user 
 */
app.put("/user", ( req:express.Request, res:express.Response ) => {

  // first will need to parse the json 
  var parsedBody;

  try{
    parsedBody = JSON.parse(req.body);
  }catch(e){
    res.status(400).json({ error: `Parameter id must be a string. Value: ${req.body}` });
  }

  // deconstruct the body to get the user data
  const user: User = User.fromJson( parsedBody );

  // validate the user 
  if( !user.validate() ){
    res.status(400).json({ error: user.error });
    return;
  }

  // convert the user back to json
  const userJson = user.toJson();
        
  // create the params
  const params = {
    TableName: USERS_TABLE,
    Item: userJson,
  };

  // do the database operation 
  dbOperator.invoke( params, "put" )
    .then((result => {
      // return the data as json to the client
      res.json( userJson );
    }))
    .catch( (err) => {
        res.status(400).json({ error: err ? err : "Could not add user" })
        return; 
    });
    
});

/** Delete a user 
 * 
 *  @param id - ID of the user 
 */
app.delete("/user/:id", ( req:express.Request, res:express.Response ) => {

  // create the params 
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.id,
    },
  }

  // do the database operation 
  dbOperator.invoke( params, "delete" )
       .then((result => {
          res.send(`User ${req.params.id} successfully deleted`);
       }))
       .catch( (err) => {
            res.status(400).json({ error: err ? err : "Could not get the user" })
            return; 
       });

});

export const hello = serverless(app);