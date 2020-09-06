import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';

@Controller('job-application')
export class JobApplicationController {
  @Put('/reorder/:id')
  reorder(@Param('id') id: string, @Body() reorderDto: any): string {
    return id;
  }
}
