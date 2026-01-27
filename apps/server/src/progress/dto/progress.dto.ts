import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  progress: number; // 0-100

  @IsNumber()
  @IsOptional()
  time_spent?: number; // seconds
}
