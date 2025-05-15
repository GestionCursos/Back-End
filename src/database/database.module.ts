import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Autoridade } from "src/autoridades/entities/autoridade.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true, 
      }),
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    entities: [Usuario,Autoridade],
    synchronize: true,      
    ssl: {
        rejectUnauthorized: false,
    },
    autoLoadEntities: true,
    }),],
    
    exports: [TypeOrmModule],
})
export class DatabaseModule {}