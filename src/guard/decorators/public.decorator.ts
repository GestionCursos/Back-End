import { SetMetadata } from "@nestjs/common";

export const Is_PUBLIC_KEY='IsPublic';
export const Public =()=> SetMetadata(Is_PUBLIC_KEY,true)