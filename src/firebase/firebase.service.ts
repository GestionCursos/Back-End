import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
    //Se crea un objeto con las credencialñes de firebase 
    private credential = {
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    };
    constructor() {
        this.initializeFirebase();
    }
    //funcion para inicialisar firebase con las creddenciales 
    private initializeFirebase() {
        if (!admin.apps.length) {
            if (!this.credential) {
                throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not defined');
            }
            const serviceAccountData = JSON.parse(JSON.stringify(this.credential)) as admin.ServiceAccount;
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccountData),
            });
        }
    }


}