import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Root health check endpoint' })
  @ApiOkResponse({ description: 'Returns the welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }
}
