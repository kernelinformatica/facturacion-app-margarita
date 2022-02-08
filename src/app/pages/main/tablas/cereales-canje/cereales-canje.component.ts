import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RecursoService } from '../../../../services/recursoService';
import { AuthService } from '../../../../services/authService';
import { LocalStorageService } from 'app/services/localStorageService';



@Component({
    selector: 'cereales-canje',
    styleUrls: ['./cereales-canje.scss'],
    templateUrl: './cereales-canje.html'
})
export class CerealesCanje {
    tableData;
    tableColumns;
    editCereal;
    editCtaContable;
    cereales = [];
    addCereal;
    addCtaContable;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService,
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {
        this.tableColumns = [
            {
                nombre: 'cereal',
                key: 'cerealCodigo',
                subkey: 'nombre',
                ancho: '30%',
                enEdicion: false,
            },
            {
                nombre: 'Cta. Contable',
                key: 'ctaContable',
                ancho: '70%',
                enEdicion: false,
            }

        ];
        this.getCereales();

    }

    getCereales = () => {
        this.recursoService.getCereales().subscribe(data => {
            this.tableData = data.cereales;
        });
        this.recursoService.getAllCereales().subscribe(data => {
            this.cereales = data;
        })
    }

    columns;
    data;
    add = () => {
        this.recursoService.abmCereales(1, this.addCtaContable, this.addCereal.cerealCodigo, null, 2).subscribe(
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
        this.editCtaContable = item.ctaContable
        this.cereales.forEach(cereal => {
            if(cereal.cerealCodigo == item.cerealCodigo.cerealCodigo) {
                this.editCereal = cereal;
            }
        })
        this.tableColumns.forEach(column => {
            column.enEdicion = item.idCanjeContratoCereal;
        });
    }
    remove = (item, index) => {
        this.recursoService.abmCereales(2, null, null, item.idCanjeContratoCereal, null).subscribe(data => {
            this.utilsService.showModal(data.codigo)(data.descripcion)()();
            if(data.codigo == "OK") {
                this.tableData = this.tableData.filter(data => data.idCanjeContratoCereal != item.idCanjeContratoCereal);
            }
        })
    }
    confirmEdit = (item, index) => {
        this.recursoService.abmCereales(3, this.editCtaContable, this.editCereal.cerealCodigo, item.idCanjeContratoCereal, 2).subscribe(
            data => {
                this.utilsService.showModal(data.codigo)(data.descripcion)()();
                if(data.codigo == "OK") {
                    item.ctaContable = this.editCtaContable;
                    item.cerealCodigo = this.editCereal;
                    this.tableColumns.forEach(column => {
                        column.enEdicion = false;
                    });
                }
            }
        )
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