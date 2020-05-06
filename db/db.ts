import * as aws         from "aws-sdk";

export default function database(  ){ 

    // instantiate the document client
    const documentClient    = new aws.DynamoDB.DocumentClient();

    /** Function for 
     * 
     * @param tableName 
     * @param key 
     * @param operation 
     * @return {Promise} 
     */
    function invoke(params: object, operation: string  ) : Promise<any>{

        // validate that the operation does exist.
        if( typeof documentClient[operation] !== "function" ) throw "Invalid databse operation"; 

        return new Promise((resolve, reject) =>  {

            documentClient[operation](params, (err, data) => {
                if (err) reject(err);
                else resolve(data);
              });

        });
    }


    // expose the invoke method 
    return {
        invoke: invoke
    }

}