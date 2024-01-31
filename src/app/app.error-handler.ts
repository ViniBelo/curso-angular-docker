import { Observable } from "rxjs"
import { HttpErrorResponse } from "@angular/common/http"
import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core"
import { NotificationService } from "./shared/messages/notification.service"
import { LoginService } from "./security/login/login.service"

@Injectable()
export class ApplicationErrorHandler extends ErrorHandler {

    constructor(private ns: NotificationService,
                private injector: Injector,
                private zone: NgZone) {
        super()
    }

    handleError(error: HttpErrorResponse | any) {
        if(error instanceof HttpErrorResponse) {
            const message = error.error.message
            this.zone.run(() => {
                switch(error.status) {
                    case 401:
                        this.injector.get(LoginService).handleLogin()
                        break
                    case 403:
                        this.ns.notify(message || 'Não autorizado.')
                        break
                    case 404:
                        this.ns.notify(message || 'Recurso não encontrado. Verifique o conseole para mais detalhes.')
                        break
                }
            })
        }
        super.handleError(error)
    }
}