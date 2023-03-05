import { BALANCES_FILE_PATH } from './../utils/constants';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { promises as fs } from 'fs';

import { MoralisService } from '../moralis/moralis.service';
import { ADDRESSES_FILE_PATH } from 'src/utils/constants';

@Injectable()
export class WalletService {
  constructor(private readonly moralisService: MoralisService) {}

  async getBalance(address: string) {
    return await this.moralisService.getWalletBalance(address);
  }

  async getTokens(address: string) {
    return await this.moralisService.getWalletTokens(address);
  }

  async writeAddressToFile(address: string) {
    try {
      const addresses = await this.getAddressesFromFile();

      if (addresses.includes(address)) {
        return;
      }

      addresses.push(address);

      await fs.writeFile(
        ADDRESSES_FILE_PATH,
        JSON.stringify(addresses),
        'utf8',
      );
    } catch (e) {
      console.error(e);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async writeDataToConfigFile() {
    try {
      const addresses = await this.getAddressesFromFile();

      const data = await Promise.all(
        addresses.map(async (address: string) => {
          const balance = await this.getBalance(address);

          return {
            address,
            balance,
            time: new Date(),
          };
        }),
      );

      await fs.writeFile(BALANCES_FILE_PATH, JSON.stringify(data), 'utf8');
    } catch (e) {
      console.error(e);
    }
  }

  private async getAddressesFromFile() {
    try {
      const file = await fs.readFile(ADDRESSES_FILE_PATH, 'utf8');

      return JSON.parse(file);
    } catch (e) {
      return [];
    }
  }
}
