//src/prisma-client-exception.filter.t
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
    private readonly logger = new LoggerService(ErrorFilter.name);

    catch(error: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const message: string = error.message ? error.message : "server error"
        const status = HttpStatus.NOT_FOUND;

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
            message: message
        })
    }
}

