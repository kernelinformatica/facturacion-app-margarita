import { Injectable } from "@angular/core";
import { AuthService } from "app/services/authService";
import { LocalStorageService } from "app/services/localStorageService";
import { environment } from "environments/environment";
import { UtilsService } from "app/services/utilsService";
import { Observable } from "rxjs";

@Injectable()
export class PasajesLogsService {
    
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private utilsService: UtilsService
    ) { }
        
}