import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [WalletModule, ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
