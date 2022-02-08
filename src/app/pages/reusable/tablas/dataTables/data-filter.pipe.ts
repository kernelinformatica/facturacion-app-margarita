import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        
        if (query) {
            // Aca me fijo que los elementos del array tengan productos adentro. Es un filtro especial
            if (
                array && array.length > 0 && array[0] &&
                array[0].producto
            ) {
                return _.filter(
                    array, 
                    row => 
                        row.producto.codProducto.toLowerCase().trim().indexOf(query.toLowerCase().trim()) > -1 
                        ||
                        row.producto.descripcion.toLowerCase().trim().indexOf(query.toLowerCase().trim()) > -1
                );
            }
        }
        return array;
    }
}