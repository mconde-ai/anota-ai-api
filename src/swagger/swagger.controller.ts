import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { absolutePath } from 'swagger-ui-dist';

@Controller()
export class SwaggerController {
  @Get('swagger-ui-dist/*')
  serveSwaggerUiDist(@Res() res: Response) {
    // A função absolutePath() nos dá o caminho para os arquivos do swagger-ui-dist
    const path = require.resolve('swagger-ui-dist');
    res.sendFile(absolutePath());
  }
}