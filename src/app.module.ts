import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PatientModule } from './modules/patient/patient.module';
import { ObservationModule } from './modules/observation/observation.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

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

    DatabaseModule,
    PatientModule,
    ObservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
