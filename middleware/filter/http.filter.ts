import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExeptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        console.log(exception)
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const status = exception.getStatus();
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            path: request.url,
            message: exception.message
        })
    }
}

