import { SetMetadata } from "@nestjs/common";

export const Is_PUBLIC_KEY='IsPublic';
//agregamos matadata en la peticion http para saber si la ruta es publica 
export const Public =()=> SetMetadata(Is_PUBLIC_KEY,true)