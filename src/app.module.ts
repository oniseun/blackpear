import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { PatientModule } from './modules/patient/patient.module';
import { ObservationModule } from './modules/observation/observation.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Logger configuration
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
          },
        },
      },
    }),

    // MongoDB connection using ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>(
          'DB_USERNAME',
        )}:${configService.get<string>(
          'DB_PASSWORD',
        )}@${configService.get<string>('DB_HOST')}:${configService.get<string>(
          'DB_PORT',
        )}/${configService.get<string>('DB_NAME')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),

    // Importing domain modules
    PatientModule,
    ObservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
