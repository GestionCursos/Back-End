import { Module } from "@nestjs/common";
import { FirebaseService } from "./firebase.service";
import { FirebaseGuard } from "src/guard/firebase.guard";

@Module({
    providers: [FirebaseService,FirebaseGuard],
    exports: [FirebaseService,FirebaseGuard],    
})
export class FirebaseModule {}