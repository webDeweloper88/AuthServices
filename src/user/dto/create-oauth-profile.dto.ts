import { IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateOAuthProfileDto {
  @IsUUID('4', { message: 'Некорректный формат userId' })
  @IsNotEmpty({ message: 'userId не должен быть пустым' })
  readonly userId: string;

  @IsString({ message: 'Провайдер должен быть строкой' })
  @IsNotEmpty({ message: 'Провайдер не должен быть пустым' })
  readonly provider: string;

  @IsString({ message: 'ProviderId должен быть строкой' })
  @IsNotEmpty({ message: 'ProviderId не должен быть пустым' })
  readonly providerId: string;

  @IsOptional()
  @IsString({ message: 'AccessToken должен быть строкой' })
  readonly accessToken?: string;
}
