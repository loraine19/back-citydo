import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log(exception)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.meta?.cause || exception.message.split('return')[1]
    let status: HttpStatus;

    switch (exception.code) {
      case 'P2002':
      case 'P2003':
      case 'P2004':
      case 'P1014':
        status = HttpStatus.CONFLICT;
        break;
      case 'P2001':
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        break;
      case 'P2000':
      case 'P2006':
      case 'P2036':
      case 'P2021':
      case 'P2020':
      case 'P2016':
      case 'P2013':
      case 'P2012':
      case 'P2011':
        status = HttpStatus.BAD_REQUEST;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: `${exception.code}: ${message}`,
    });
  }
}
