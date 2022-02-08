import { Injectable } from "@angular/core";
import { UtilsService } from "app/services/utilsService";

@Injectable()
export class PopupListaService {

    constructor(public utilsService: UtilsService) { }
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// Servicios popup ////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    keyPressInputForPopup = (upOrDown) => (itemsLista) => (productoEnfocadoIndex) => {
        // Primero checkeo que el indice no se paseo
        if (
            itemsLista.length > 0 &&
            !(upOrDown === 'down' && productoEnfocadoIndex === itemsLista.length - 1) &&
            !(upOrDown === 'up' && productoEnfocadoIndex === 0)
        ) {
            
            // Primero actualizo el indice
            const newIndex = productoEnfocadoIndex + (upOrDown === 'down' ? 1 : -1);

            // Dsps les saco el enfoque a todos los elementos de la lista
            itemsLista.forEach(item => {
                const aux = 
                    item.producto ? document.getElementsByClassName('li-popup-'+item.producto.idProductos) :
                    item.idProductos ? document.getElementsByClassName('li-popup-'+item.idProductos) :
                    item.padronCodigo ? document.getElementsByClassName('li-popup-'+item.padronCodigo) : 
                    null        

                // Le saco la clase que lo tiene seleccionado
                if (aux && aux[0] && aux[0].className) {
                    aux[0].className = 
                        item.producto ? 'list-group-item listElement li-popup-'+item.producto.idProductos :
                        item.idProductos ? 'list-group-item listElement li-popup-'+item.idProductos :
                        item.padronCodigo ? 'list-group-item listElement li-popup-'+item.padronCodigo : 
                            null ;
                }
            });

            // Agarro el producto seleccenfocadoionado
            // const itemEnfocado = _.clone(itemsLista[newIndex]);
            const itemEnfocado = {...itemsLista[newIndex]};

            // Agarro el elemento dom de la lista
            const liPopup: HTMLCollectionOf<any> = 
                itemEnfocado.producto ? document.getElementsByClassName('li-popup-'+itemEnfocado.producto.idProductos) :
                itemEnfocado.idProductos ? document.getElementsByClassName('li-popup-'+itemEnfocado.idProductos) :
                itemEnfocado.padronCodigo ? document.getElementsByClassName('li-popup-'+itemEnfocado.padronCodigo) :
                null;
                        
            // Lo selecciono y enfoco (si agarró algo)
            if (liPopup && liPopup[0] && liPopup[0].className) {
                liPopup[0].className += ' active-pop-elem';
            }

            // Si el item seleccionado es mayor a 9 (porque entran 10 en la lista), scrolleo un poco
            if (productoEnfocadoIndex >= 9) {
                const ulLista: HTMLCollectionOf<Element> = document.getElementsByClassName('ul-lista-popup');
                // Aca es 25 porque el alto de los <li> es 25
                const cantScroll = 25; 

                ulLista[0].scrollTop += upOrDown === 'down' ? cantScroll : (cantScroll*-1);
            }
            
            return newIndex;
        } else {
            
            return productoEnfocadoIndex;
        }
    }


    getOffsetOfInputCliente = (idElemento) => this.utilsService.getOffset(document.getElementById(idElemento))

}