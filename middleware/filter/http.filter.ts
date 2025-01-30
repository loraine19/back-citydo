import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';

@Catch(HttpException)
export class HttpExeptionFilter implements ExceptionFilter {
    private readonly logger = new LoggerService(HttpExeptionFilter.name);
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const message = exception.message

        this.logger.error(`
            Time: ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}
            Status: ${status} 
            Error: ${message} 
            Path: ${request.url}
            Method: ${request.method}
          `);


        response.status(status).json({
            statusCode: status,
            timestamp: ` ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}`,
            path: request.url,
            message
        })
    }
}

