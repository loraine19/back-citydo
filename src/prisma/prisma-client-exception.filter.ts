//src/prisma-client-exception.filter.t
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { error } from 'console';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.meta?.cause || exception.message.split('return')[1].replace('(\n', ' : ');
    switch (exception.code) {
      case 'P2002':
      case 'P2003':
      case 'P2004':
      case 'P014': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: exception.code + ' : ' + message,
        });
        break;
      }
      case 'P2001':
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: exception.code + ' : ' + message,
        });
        break;
      }
      case 'P2000':
      case 'P2025':
      case '2006':
      case '2036':
      case 'P2021':
      case 'P2021':
      case 'P2020':
      case 'P2016':
      case 'P2013':
      case 'P2012':
      case 'P2011':
        {
          const status = HttpStatus.BAD_REQUEST;
          response.status(status).json({
            statusCode: status,
            message: exception.code + ' : ' + message,
          });
          break;

        }

      default: {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
          statusCode: status,
          message: exception.code + ' : ' + message,
        });
        break;

      }
    }
  }
}
