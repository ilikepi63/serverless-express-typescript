import Utils        from "../utils/utils";

export default class User{

    id: string;
    name: string;
    surname: string;
    error: string;

    constructor(id: string, name: string, surname: string){

        /** TODO: add a validator in the constructor 
         * 
         */
        this.id         = id;
        this.name       = name;
        this.surname    = surname;
    }

    /** Get the current error message
     * 
     */
    getErrorMessage() : string { return this.error };

    /** Validate the current user, otherwise will return 
     *  
     */
    validate( ) : boolean {

        // check the id
        if (!Utils.isString( this.id )) {
            this.error =  '"id" must be a string' 
            return false;
        };

        // check the name
        if ( !Utils.isString( this.name ) ) {
            this.error =  '"name" must be a string' 
            return false;
        };

        // check the surname
        if (!Utils.isString( this.surname )) {
            this.error =  '"name" must be a string' 
            return false;
        }; 


        return true;
    }  


    /** Convert json to User 
     * 
     */
    static fromJson( json: any ) : User {

        const {id, name, surname} = json; 

        return new User( id, name, surname );
    }

    /** Convert User to Json
     * 
     */
    toJson() : any {
        return { userId : this.id, name: this.name, surname: this.surname };
    };
}