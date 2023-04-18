import { Component, Input } from '@angular/core';
import { UtilsService } from 'app/services/utilsService';

@Component({
    selector: 'data-tables',
    templateUrl: './dataTables.html',
    styleUrls: ['./dataTables.scss']
})

/**
 * Tabla reutilizable
 */
export class DataTables {
    @Input() columns;
    @Input() data;
    @Input() edit;
    @Input() remove;
    @Input() confirmEdit;
    @Input() check;
    @Input() rowsOnPage = 10; //Default es 10 si no se envía como un parámetro en la tabla
    
    // Opciones custom
    @Input() enableEditDelete = true;

    /////////// BUSQUEDA ///////////
    // Array con items de los cuales se busca si enableAdd esta habilitado
    @Input() itemsBusqueda;
    textoBuscado;

    
    sortBy = 'nombre';
    sortOrder = "asc";

    // Sistema de filtros
    @Input() filtrosActivos = false;

    // Sistema de búsqueda
    @Input() filterQuery = "";
    

    constructor(
        public utilsService: UtilsService
    ) {}

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
        if (this.columns) {
            return this.columns.some(col=>{
                if (!col.subkey) {
                    return col.enEdicion && col.enEdicion === item[this.utilsService.getNameIdKeyOfResource(item)];
                } else if (col.subkey && !col.subsubkey) {
                    return col.enEdicion && col.enEdicion === (item[col.key])[this.utilsService.getNameIdKeyOfResource(item[col.key])];
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
