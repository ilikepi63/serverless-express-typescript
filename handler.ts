import * as serverless  from "serverless-http";
import express          from "express";
import bodyParser       from "body-parser";
import * as aws         from "aws-sdk";
import Utils            from "./utils/utils";
import User             from "./models/user";


// instantiate the express app here
const app = express()

// get the USER_TABLES from the environment variables
const { USERS_TABLE } = process.env;

// instantiate the document client
const dynamoDb = new aws.DynamoDB.DocumentClient();

// use body parser to interpret body data from express request object
app.use( bodyParser.json( { strict: false } ) );

/** Get users with specific constraints
 * 
 */
app.get('/user', function ( req:express.Request, res:express.Response ) {

  const params:aws.DynamoDB.DocumentClient.GetItemInput = {
    TableName: USERS_TABLE,
    Key: {

    },
  };

  dynamoDb.get(params, (err, result) => {

    // if there was an error, then return a reasonable response
    if (err) res.status(400).json({ error: 'Could not get user' });

    // check if there is a response with an item 
    if(!result){
      // otherwise return a not found error
      res.status(404).json({ error: "User not found" });
      return;
    }

    // check if there is a response with an item 
    if(!result.Item){
      // otherwise return a not found error
      res.status(404).json({ error: "User not found" });
      return;
    }


      // deconstruct the object to get the userId and name
      const {userId, name, surname} = result.Item;

      // construct a new object that will be sent back to the client as json 
      res.json({ userId, name, surname });


      
    
  });

});

/** Get an user with a specific id
 * 
 *  @param id - ID of the user 
 */
app.get('/user/:id', ( req:express.Request, res:express.Response )  => {

  // create the params 
  const params:aws.DynamoDB.DocumentClient.GetItemInput  = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.id,
    },
  }

  // issue the query
  dynamoDb.get(params, ( err, result ) => {

    // if there was an error, then return a reasonable response
    if (err){
      res.status(400).json({ error: 'Could not get user' })
      return; 
    };

    if (result && result.Item) {
      
      // if an item was returned, then send it back 
      const {userId, name, surname} = result.Item;

      // return the data as json to the client
      res.json({ userId, name, surname });
    } else {

      //otherwise return a 404 if a user was not found
      res.status(404).json({ error: "User not found" });
    }
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

  if( !user.validate() ){
    res.status(400).json({ error: user.error });
    return;
  }

  const userJson = user.toJson();
        
  const params = {
    TableName: USERS_TABLE,
    Item: userJson,
  };

  dynamoDb.put(params, error => {
    
    if (error){
      res.status(400).json({ error })
      return;
    };

    res.json( userJson );
  });

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