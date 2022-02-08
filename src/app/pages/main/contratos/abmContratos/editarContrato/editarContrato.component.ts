import { Component, HostListener } from '@angular/core';
import { Padron } from 'app/models/padron';
import { Contrato } from 'app/models/contrato';
import { SisCanje } from 'app/models/sisCanje';
import { Observable } from 'rxjs';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'app/services/utilsService';
import { ContratosService } from 'app/services/contratosService';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'editar-contrato',
    styleUrls: ['./editarContrato.scss'],
    templateUrl: './editarContrato.html',
    providers: [NgbDatepickerConfig]
})
export class EditarContrato {

    recurso: Contrato = new Contrato();
    recursoOriginal: Contrato = new Contrato();

    modelInputFile: any;
    file;

    sisCanjes: Observable<SisCanje[]>;

    constructor(
        private contratosService: ContratosService,
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        config: NgbDatepickerConfig
    ) {

        this.route.params.subscribe(params => 
            this.recursoService.getRecursoList(resourcesREST.contratos)()
                .map((recursoList: Contrato[]) =>
                    recursoList.find(recurso => recurso.idContratos === parseInt(params.idContratos))
                )
                .subscribe(recurso => {
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );

        this.sisCanjes = this.recursoService.getRecursoList(resourcesREST.sisCanjes)();

        // config NgbDatepickerConfig
        config.minDate = {year: 1850, month: 1, day: 1};
        config.maxDate = {year: 2020, month: 12, day: 31};    
    }

    // Si NO finalizó la edición, y SI editó el recurso..
    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.getEdicionFinalizada() ||
        this.recursoService.checkIfEquals(this.recurso, this.recursoOriginal);

    onFileSelected = (e) => {
        const existFile = e.target && e.target.files && e.target.files.length > 0;
        const file = existFile ? e.target.files[0] : null;
        this.file = file;
    }

    onGenerar = () => {
        if (this.file) {
            this.contratosService.generarContrato(this.file);
        }
    }

    onGrabar = () => {
        
        this.contratosService
            .editarContrato(this.file, this.recurso, () => this.router.navigate(['/pages/contratos/abm']))
        
    }

    onSelectCliente = (cli: Padron) => {
        this.recurso.idPadron = cli.padronCodigo;

        setTimeout(
            () => document.getElementById('idFechaNacInput').focus()
        )
    }
}
