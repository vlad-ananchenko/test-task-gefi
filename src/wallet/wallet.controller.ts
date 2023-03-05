import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';

import { WalletService } from './wallet.service';
import { GetBalanceQueryDto } from './dto/get-balance-query.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getBalance(
    @Query(new ValidationPipe()) { address }: GetBalanceQueryDto,
  ) {
    const balance = await this.walletService.getBalance(address);
    const tokens = await this.walletService.getTokens(address);

    await this.walletService.writeAddressToFile(address);

    return { balance, tokens };
  }
}
