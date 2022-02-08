import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { Producto } from '../../../../models/producto';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'productos',
    styleUrls: ['./productos.scss'],
    templateUrl: './productos.html'
})

export class Productos {
    // Data de la tabla
    allProductos: Producto[];
    productosFiltrados: Producto[];
    // Columnas de la tabla
    tableColumns;


    // Filtros de la tabla
    filtros: {
        codigo: string,
        descripcion: string,
        rubro: string,
        subRubro: string
    } = {
            codigo: '',
            descripcion: '',
            rubro: '',
            subRubro: '',
        }

    constructor(
        private recursoService: RecursoService,
        private router: Router,
        public utilsService: UtilsService
    ) {
        this.tableColumns = [
            {
                nombre: 'Código',
                key: 'codProducto',
                ancho: '10%',
                customClass: 'text-left',
                nombreFiltro: 'codigo'
            },
            {
                nombre: 'descripción',
                key: 'descripcion',
                ancho: '22%',
                customClass: 'text-left',
                nombreFiltro: 'descripcion'
            },
            {
                nombre: 'Rubro',
                key: 'subRubro',
                subkey: 'rubro',
                subsubkey: 'descripcion',
                ancho: '22%',
                customClass: 'text-left',
                nombreFiltro: 'rubro'
            },
            {
                nombre: 'Sub rubro',
                key: 'subRubro',
                subkey: 'descripcion',
                ancho: '22%',
                customClass: 'text-left',
                nombreFiltro: 'subRubro'
            }
        ]

        // this.tableData = this.recursoService.getRecursoList(resourcesREST.productos)();
        this.recursoService.getRecursoList(resourcesREST.productos)().subscribe(resp => {
            this.allProductos = resp;
            this.productosFiltrados = resp;
        })
    }

    onClickEdit = (recurso: Producto) => {
        this.router.navigate(['/pages/stock/productos/editar', recurso.idProductos]);
    }

    onClickRemove = async (recurso: Producto) => {
        this.utilsService.showModal(
            'Borrar producto'
        )(
            '¿Estás seguro de borrar el producto?'
        )(
            async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idProductos)(resourcesREST.productos);

                // this.tableData = 
                this.recursoService.getRecursoList(resourcesREST.productos)().subscribe(resp => {
                    this.productosFiltrados = resp;
                })
            }
        )({
            tipoModal: 'confirmation'
        });
    }

    /**
     * Filtra aplicando todos los filtros
     */
    onFilter = (valor) => 
        this.productosFiltrados = this.allProductos
            .filter(producto => this.filtros.codigo.length > 0 ? producto.codProducto.toLowerCase().includes(this.filtros.codigo) : true)
            .filter(producto => this.filtros.descripcion.length > 0 ? producto.descripcion.toLowerCase().includes(this.filtros.descripcion) : true)
            .filter(producto => this.filtros.rubro.length > 0 ? producto.subRubro.rubro.descripcion.toLowerCase().includes(this.filtros.rubro) : true)
            .filter(producto => this.filtros.subRubro.length > 0 ? producto.subRubro.descripcion.toLowerCase().includes(this.filtros.subRubro) : true)

    
}




