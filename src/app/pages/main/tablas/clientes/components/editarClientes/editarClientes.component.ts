import { Component, Input, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { Cliente } from '../../../../../../models/cliente';
import { Padron } from 'app/models/padron';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { Categoria } from 'app/models/categoria';
import gruposParametros from 'constantes/gruposParametros';
import sisCategorias from 'constantes/sisCategorias';

@Component({
    selector: 'editar-clientes',
    styleUrls: ['./editarClientes.scss'],
    templateUrl: './editarClientes.html',
})
export class EditarClientes {
    recurso: Cliente = new Cliente();
    recursoOriginal: Cliente = new Cliente();
    
    clientesPadron: Padron[];
    clientesPadronComplete: Padron[];
    
    vendedoresPadron: Padron[];

    categoriasCliente: Observable<Categoria[]>;
    categoriasVendedor: Observable<Categoria[]>;

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params => 
            this.recursoService.getRecursoList(resourcesREST.cliente)()
                .map((recursoList: Cliente[]) =>
                    recursoList.find(recurso => recurso.idCliente === parseInt(params.idCliente))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );

        const promiseClientes = this.recursoService.getRecursoList(resourcesREST.padron)({
            grupo: gruposParametros.cliente
        }).toPromise();

        const promiseVendedores = this.recursoService.getRecursoList(resourcesREST.padron)({
            grupo: gruposParametros.vendedor
        }).toPromise();

        Promise.all([promiseClientes, promiseVendedores]).then(resp => {
            this.clientesPadron = this.getMoreClientes(resp[0]);
            this.clientesPadronComplete = resp[0];
            this.vendedoresPadron = resp[1];
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

    // Si NO finalizó la edición, y SI editó el recurso..
    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.getEdicionFinalizada() ||
        this.recursoService.checkIfEquals(this.recurso, this.recursoOriginal);

    onClickEditar = async() => {
        try {
            const respuestaEdicion: any = await this.recursoService.setRecurso(
                this.recurso
            )();
    
            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
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
                cli =>  cli.padronApelli.toLowerCase().includes(busq.toLowerCase()) ||
                        cli.padronNombre.toLowerCase().includes(busq.toLowerCase())
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
}
