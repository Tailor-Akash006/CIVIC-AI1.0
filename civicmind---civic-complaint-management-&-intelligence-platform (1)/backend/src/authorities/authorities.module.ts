import { Module } from '@nestjs/common';
import { AuthoritiesController } from './authorities.controller';
import { AuthoritiesService } from './authorities.service';

@Module({
  controllers: [AuthoritiesController],
  providers: [AuthoritiesService],
  exports: [AuthoritiesService],
})
export class AuthoritiesModule {}
