import {Request, Response} from "express";

export default class Utils{

    /** Function to check if an input is a string
     * 
     * @param input
     * @return boolean to determine whether the input is a string
     */
    static isString = ( input : any ) : boolean =>  ( typeof input === "string" );

    /** Function to check if a the first param is true, otherwise  
     *  will return an errormessage 
     * 
     */
    static returnTypeErrorIf = ( x: boolean, alias:string, type:string ) : any => x ? true : `${alias} is not a ${type}`;

}