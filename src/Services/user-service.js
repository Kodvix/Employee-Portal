import {myAxios} from "./helper.js";

export const signUp = (user) =>{
    return myAxios.post('/auth/register',user).then((response)=>response.json())

};