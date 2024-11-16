import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    //const message = exception instanceof HttpException ? exception.getResponse() : exception;
    let message: any;
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message = typeof response === 'string' ? response : (response as any).message || response;
    } else {
      message = exception instanceof Error ? exception.message : 'Internal server error';
    }
    const stack = exception instanceof Error ? exception.stack : '';


    this.logger.error(`Http status: ${status} Error message: ${JSON.stringify(message)} Stack: ${stack}`);
    
    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message
    });
  }
}