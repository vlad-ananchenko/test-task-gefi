import { IsString, Matches } from 'class-validator';

export class GetBalanceQueryDto {
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/g, {
    message: 'Address must be a valid Ethereum address',
  })
  address: string;
}
