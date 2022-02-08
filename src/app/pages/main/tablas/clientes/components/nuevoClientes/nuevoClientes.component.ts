import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { Component, Input, HostListener } from '@angular/core';

import { Cliente } from '../../../../../../models/cliente';
import { Padron } from 'app/models/padron';
import { resourcesREST } from 'constantes/resoursesREST';
import gruposParametros from 'constantes/gruposParametros';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { Categoria } from '../../../../../../models/categoria';
import sisCategorias from 'constantes/sisCategorias';
import { ClienteModPost } from 'app/models/clienteModPost';

@Component({
    selector: 'nuevo-clientes',
    styleUrls: ['./nuevoClientes.scss'],
    templateUrl: './nuevoClientes.html',
})

export class NuevoClientes {
    // recurso: ClienteModPost = new ClienteModPost();
    recurso: Cliente = new Cliente();

    clientesPadron: Padron[];
    clientesPadronComplete: Padron[];
    
    vendedoresPadron: Padron[];

    categoriasCliente: Observable<Categoria[]>;
    categoriasVendedor: Observable<Categoria[]>;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) {

        const promiseClientes = this.recursoService.getRecursoList(resourcesREST.padron)({
            grupo: gruposParametros.cliente
        }).toPromise();

        const promiseVendedores = this.recursoService.getRecursoList(resourcesREST.padron)({
            grupo: gruposParametros.vendedor
        }).toPromise();

        // console.table(resp[0])
        Promise.all([promiseClientes, promiseVendedores]).then(resp => {
            this.clientesPadron = this.getMoreClientes(resp[0]);
            this.clientesPadronComplete = resp[0];
            this.vendedoresPadron = resp[1];
            
            // Checkeo query params
            this.route.queryParams
                .subscribe(params => {
                    if (params && params.codPadronCliente) {
                        // Busco el padro que viene por query y lo selecciono por defecto
                        this.clientesPadron = [].concat(
                            this.clientesPadronComplete.find(
                                cliPadron => Number(cliPadron.padronCodigo) === Number(params.codPadronCliente)
                            )
                        )

                        // Lo seteo como seleccionado
                        this.recurso.padronGral.idPadronGral = Number(params.codPadronCliente);
                    }
                });

        });

        this.categoriasCliente = this.recursoService.getRecursoList(resourcesREST.categorias)({
            idSisCategoria: sisCategorias.cliente
        });
        this.categoriasVendedor = this.recursoService.getRecursoList(resourcesREST.categorias)({
            idSisCategoria: sisCategorias.vendedor
        });

    }

    PARCIAL_SIZE = 30;

    getMoreClientes = (arr) => {
        // const porDondeVa = this.clientesPadron.indexOf(
        //     this.clientesPadron[this.clientesPadron.length - 1]
        // );
        const porDondeVa = this.clientesPadron ? this.clientesPadron.length : 0;

        return arr ? arr.slice(
            porDondeVa,
            porDondeVa + this.PARCIAL_SIZE
        ) : null
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new Cliente()) || 
        this.recursoService.getEdicionFinalizada();

    onClickCrear = async () => {
        try {

            const resp: any = await this.recursoService.setRecurso(this.recurso)();
    
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/clientes']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);       
        }
    }


    textBusqueda = '';
    busquedaActiva = false;

    onBuscar = (busq) => {

        if (!busq || busq.length <= 3) {
            this.clientesPadron = this.clientesPadronComplete.slice(0, this.PARCIAL_SIZE);

            this.busquedaActiva = false;
        }

        if (busq && busq.length > 3) {
            const encontrado = this.clientesPadronComplete.filter(
                cli =>  (
                            cli.padronApelli && cli.padronApelli.toLowerCase().includes(busq.toLowerCase())
                        ) || 
                        (
                            cli.padronNombre && cli.padronNombre.toLowerCase().includes(busq.toLowerCase())
                        )
            );
    
            // this.clientesPadron = encontrado && encontrado.length !== this.clientesPadronComplete.length ? 
            //     encontrado : this.clientesPadronComplete.slice(0, this.PARCIAL_SIZE);

            if (encontrado && encontrado.length !== this.clientesPadronComplete.length) {
                this.clientesPadron = encontrado;
                this.busquedaActiva = true;
            } else {
                this.clientesPadron = this.clientesPadronComplete.slice(0, this.PARCIAL_SIZE);
                this.busquedaActiva = false;
            }
        }
    }

    moreClientesInfinite = () => {
        this.clientesPadron = this.clientesPadron.concat(
            this.getMoreClientes(this.clientesPadronComplete)
        )
    }

    onClickVendedor = (vend) => () =>
        this.recurso.padronGral && this.recurso.padronGral.idPadronGral ?
            this.recurso.vendedor.padronGral.idPadronGral = vend.padronCodigo : null

    onConditionVendedor = (vend) => {
        this.recurso.vendedor.padronGral && this.recurso.vendedor.padronGral.idPadronGral === vend.padronCodigo
    }
}
