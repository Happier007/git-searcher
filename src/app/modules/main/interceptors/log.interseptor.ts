import {
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Log } from '@models/log';

export class LogInterseptor implements HttpInterceptor {
    public logInfo: Log;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.logInfo = new Log(req.method, req.urlWithParams);
        return next.handle(req)
            .pipe(
                tap((event: HttpEvent<any>) => {
                        if (event instanceof HttpResponse) {
                            this.logInfo.status = event.status;
                            console.log(JSON.stringify(this.logInfo, null, 2));
                        }
                    },
                    (err: HttpErrorResponse) => {
                        this.logInfo.message = err.message;
                        this.logInfo.status = err.status;
                        console.log(JSON.stringify(this.logInfo, null, 2));
                    }
                ),
                catchError((error: HttpErrorResponse) => {
                         return EMPTY;
                        // return throwError(error);
                    }
                )
            );
    }
}
