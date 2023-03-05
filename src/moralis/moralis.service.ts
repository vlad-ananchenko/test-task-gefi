import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Moralis from 'moralis';
import {
  EvmChain,
  GetNativeBalanceResponseAdapter,
  GetWalletTokenBalancesResponseAdapter,
} from '@moralisweb3/common-evm-utils';

import { IWalletToken } from './../interfaces/wallet-token.interface';

@Injectable()
export class MoralisService {
  private readonly chain: EvmChain = EvmChain.ETHEREUM;

  async getWalletBalance(address: string): Promise<string> {
    try {
      const balance: GetNativeBalanceResponseAdapter =
        await Moralis.EvmApi.balance.getNativeBalance({
          address,
          chain: this.chain,
        });
      return balance.result.balance.ether;
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWalletTokens(address: string): Promise<IWalletToken[]> {
    try {
      const tokenBalances: GetWalletTokenBalancesResponseAdapter =
        await Moralis.EvmApi.token.getWalletTokenBalances({
          address,
          chain: this.chain,
        });

      const tokens = tokenBalances.result.map(({ value, token }) => {
        if (token) {
          return {
            name: token.name,
            symbol: token.symbol,
            balance: value,
          };
        }
      });

      const filteredTokens = tokens.filter((token) => Boolean(token));
      return filteredTokens as IWalletToken[];
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
