import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from '../../../../services/recursoService';
import { AuthService } from '../../../../services/authService';
import { LocalStorageService } from 'app/services/localStorageService';



@Component({
    selector: 'parametros-canje',
    styleUrls: ['./parametros-canje.scss'],
    templateUrl: './parametros-canje.html'
})
export class ParametrosCanje {
    tableData;
    tableColumns;
    editCereal;
    editInteresDiario;
    editDiasLibres;
    cereales = [];
    addCereal;
    addInteresDiario;
    addDiasLibres;
    interesMensualPesificado;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService,
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {
        this.tableColumns = [
            {
                nombre: 'Cereal',
                key: 'canjeCereal',
                subkey: 'cerealCodigo',
                subsubkey: 'nombre',
                ancho: '30%',
                enEdicion: false,
            },
            {
                nombre: 'Interés diario',
                key: 'interesDiario',
                ancho: '20%',
                enEdicion: false,
            },
            {
                nombre: 'Días libres',
                key: 'diasLibres',
                ancho: '20%',
                enEdicion: false,
            },
        ];
        this.getParametros();

    }

    getParametros = () => {
        this.recursoService.getParametrosCanje().subscribe(data => {
            this.tableData = data;
        });
        this.recursoService.getCereales().subscribe(data => {
            this.cereales = data.cereales;
        })
        this.recursoService.getParametroPesificado().subscribe(data => {
            this.interesMensualPesificado = Number(data.control.descripcion);
        })
    }

    columns;
    data;
    add = () => {
        this.recursoService.abmParametrosCanje(1, this.addInteresDiario, this.addDiasLibres, this.addCereal.cerealCodigo.cerealCodigo, null, 2, null).subscribe(
            data => {
                if(data.codigo == "OK") {
                    this.utilsService.showModal(data.codigo)(data.descripcion)(() => {
                        window.location.reload();
                    })();
                } else {
                    this.utilsService.showModal(data.codigo)(data.descripcion)()();
                }
                
            }
        )
    }
    edit = (item, index) => {
        this.editInteresDiario = item.interesDiario;
        this.editDiasLibres = item.diasLibres;
        this.cereales.forEach(cereal => {
            if(cereal.cerealCodigo.cerealCodigo == item.canjeCereal.cerealCodigo.cerealCodigo) {
                this.editCereal = cereal;
            }
        })
        this.tableColumns.forEach(column => {
            column.enEdicion = item.idParametroCanje;
        });
    }
    remove = (item, index) => {
        this.recursoService.abmParametrosCanje(2, null, null, null, null, 2, item.idParametroCanje).subscribe(data => {
            this.utilsService.showModal(data.codigo)(data.descripcion)()();
            if(data.codigo == "OK") {
                this.tableData = this.tableData.filter(data => data.idParametroCanje != item.idParametroCanje);
            }
        })
    }
    confirmEdit = (item, index) => {
        this.recursoService.abmParametrosCanje(3, item.interesDiario, item.diasLibres, this.editCereal.cerealCodigo.cerealCodigo, null, 2, item.idParametroCanje).subscribe(
            data => {
                this.utilsService.showModal(data.codigo)(data.descripcion)()();
                if(data.codigo == "OK") {
                    item.canjeCereal = this.editCereal;
                    this.tableColumns.forEach(column => {
                        column.enEdicion = false;
                    });
                }
            }
        )
    }

    modificarParametroPesificado = () => {
        this.recursoService.modificarParametroPesificado(this.interesMensualPesificado).subscribe(data => {
            this.utilsService.showModal(data.codigo)(data.descripcion)()();
        })
    }
    // Opciones custom
    enableEditDelete = true;
    /////////// BUSQUEDA ///////////
    // Array con items de los cuales se busca si enableAdd esta habilitado
    itemsBusqueda;
    textoBuscado;

    
    sortBy = 'nombre';
    rowsOnPage = 10;
    sortOrder = "asc";

    // Sistema de filtros
    filtrosActivos = false;

    // Sistema de búsqueda
    filterQuery = "";


    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }

    /**
     * Obtiene el style a partir de una columna
     * @param col
     */
    getStyleFromCol(col) {
        let styles = {
            'width': col.ancho
        };
        return styles;
    }

    /**
     * Este método checkea el tipo de dato de la key y la parsea de acuerdo a el. Por ejemplo, si es boolean retrona 'si' en 'true' y 'no' en 'false'
     * @param key
     */
    parseKey(key) {
        const tipoDato:any = typeof key;

        if (tipoDato === 'boolean') {
            return key ? 'Si' : 'No';
        } else if (tipoDato === 'object'){
            // Me fijo el nombre de la clase del objeto
            if (key.constructor.name === 'DateLikePicker') {
                return `${key.day<10 ? '0' : ''}${key.day}/${key.month<10 ? '0' : ''}${key.month}/${key.year}`
            }

            if (key.constructor.name === 'Date') {
                return this.utilsService.prettyDate(key);
            }
        };
        
        return key;
    }

    // Checkea si pongo el 'tick' para finalizar la edicion. Osea, si está en edición.
    checkIfEditOn(item) {
        if (this.tableColumns) {
            return this.tableColumns.some(col=>{
                if (!col.subkey) {
                    return col.enEdicion && col.enEdicion === item[this.utilsService.getNameIdKeyOfResource(item)];
                } else if (col.subkey && !col.subsubkey) {
                    return col.enEdicion && col.enEdicion === item[this.utilsService.getNameIdKeyOfResource(item)];
                } 

            });
        };
    }

    /**
     * 
     */
    onChangeInputItemAdd = (e) => {
        // console.log('da');
        this.itemsBusqueda.subscribe(a=>console.log(a));
    }

}