import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from '../pages/reusable/modals/default-modal/default-modal.component';
import { AppState } from 'app/app.service';
import { ConfirmationModal } from 'app/pages/reusable/modals/confirmation-modal/confirmation-modal.component';
import { isString } from 'util';
// import dynamicClass from 'app/services/dynamicClassService';
import {dynamicClass} from 'app/services/dynamicClassService';
import { resourcesREST } from 'constantes/resoursesREST';
import { DateLikePicker } from 'app/models/dateLikePicker';
import { ImprimirModal } from 'app/pages/reusable/modals/imprimir-modal/imprimir-modal.component';
import { Padron } from 'app/models/padron';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from './localStorageService';
import { Numerador } from 'app/models/numerador';
import { Observable } from 'rxjs';
import { ComprobanteService } from './comprobanteService';

@Injectable()
export class UtilsService {

    constructor(
        private modalService: NgbModal,
        private appState: AppState,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        //private comprobanteService: ComprobanteService
    ) { }

    /** TODO: Refactorizar este modal y poner bien el titulo y la descrip
     * Método que muestra un modal con el error de logueo
     */
    showModal = (titulo) => (descripcion) => (onClick?) => (datos?, onClickNo?, isInnerHTML?) => {
        // Creo el modal
        let activeModal;
        // Me fijo el tipo de modal a mostrar
        if (datos && datos.tipoModal === 'confirmation') {
            // Si o no modal
            activeModal = this.modalService.open(ConfirmationModal, { size: 'sm' });
            activeModal.componentInstance.modalHeader = titulo;
            activeModal.componentInstance.modalContent = descripcion;
            

            // Textos custom
            if (datos.textos) {
                activeModal.componentInstance.afirmativeText = datos.textos.afirmativeText;
                activeModal.componentInstance.negativeText = datos.textos.negativeText;
            }
        } else {
            // Default
            activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
            activeModal.componentInstance.modalHeader = titulo;
            activeModal.componentInstance.modalContent = descripcion;
        }

        activeModal.isInnerHTML = isInnerHTML;

        if (onClick) {
            return activeModal.result.then(result => {
                // Si hizo click en 'Si', entonces ejecuto la acción.
                if (result) {
                    onClick();
                } else {
                    if (onClickNo)
                        onClickNo();
                }
            });
        } else {
            return activeModal.result;
        }
    }

    showImprimirModal = (titulo) => (descripcion) => (callbackImprimir) => (currentComprobante) => {
        let activeModal = this.modalService.open(ImprimirModal, { size: 'sm', });
        activeModal.componentInstance.modalHeader = titulo;
        activeModal.componentInstance.modalContent = descripcion;
        activeModal.componentInstance.onClickImprimir = callbackImprimir;
        activeModal.componentInstance.currentComprobante = currentComprobante;
    }

    showImprimirModalAceptar = (titulo) => (descripcion) => (callbackImprimir) => (currentComprobante) => (callbackAceptar) => {
        let activeModal = this.modalService.open(ImprimirModal, { size: 'sm', });
        activeModal.componentInstance.modalHeader = titulo;
        activeModal.componentInstance.modalContent = descripcion;
        activeModal.componentInstance.onClickImprimir = callbackImprimir;
        activeModal.componentInstance.currentComprobante = currentComprobante;
        activeModal.componentInstance.onClickAceptar = callbackAceptar;
    }

    /**
     * Retorna si un email es valido
     */
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    /**
     * Decodifica la respuesta de error y muestra el error
     * @param ex
     */
    decodeErrorResponse = (ex) => {
        console.log(ex);
        let errorBody;

        if (isString(ex['_body'])) {
            errorBody = JSON.parse(ex['_body']);
        } else {
            errorBody = ex['_body'];
        }

        // Mostrar mensaje de error
        this.showModal(errorBody.control.codigo)(errorBody.control.descripcion)()()

        return Observable.throw(null);
    }

    /**
     * Retorna una promise error con el formato de la respuesta del servicio REST
     */
    getPromiseErrorResponse = (titulo) => (descripcion) => {
        return Promise.reject({
            '_body': {
                control: {
                    codigo: titulo,
                    descripcion: descripcion
                }
            }
        });
    }

    /**
     * Dado un objeto de una clase es incompleto, retorna true si algùn campo es null
     * @param objeto El objeto
     * @param ignoreList Lista de keys que no se van a checkear. Formato: ['key1','key2',...,'keyn']
     * @param extraCondition Funcion con condiciones extras particulares de cada formulario
     */
    checkIfIncomplete = (objeto: any) => (ignoreList?: string[])  => (extraCondition?) => {

        // Obtengo la primer key de la clase del objeto recibido
        const idRecurso = Object.keys(objeto)[0];

        // Recorro las keys y checkeo que NO sean null (excepto ignoradas)
        const someKeyIsNull = Object.keys(objeto).some((key) => {
            // Si la key NO está incluida en las ignoradas, la evaluo
            if (
                key !== idRecurso &&
                key !== 'observaciones' &&
                key !== 'empresa'  &&
                (!ignoreList || !ignoreList.includes(key))
            ) {
                // Si es un json..
                if (objeto[key] && typeof objeto[key] === 'object') {
                    const idObjecto = Object.keys(objeto[key])[0];
                    return objeto[key][idObjecto] === null || objeto[key][idObjecto] === '';
                } else {
                    return objeto[key] === '' || objeto[key] === null
                }
            }
        });
        // Evaluo condicion extra
        const resultExtraCondition = extraCondition ? extraCondition(objeto) : false;


        // Si alguna key es null o si se cumple la condicion extra (si esta existe), entonces retorno true (lo uqe significa que deshabilita el button de confirmar)
        return  someKeyIsNull || resultExtraCondition;
    }

    /**
     * A partir de un recurso, retorna la referencia 'rest' (esto es, el endpoitn al que apuntar del services)
     */
    getNameRestOfResource = (recurso) => {
        // Obtengo la clase del objeto recibido
        const ClaseRecurso = dynamicClass(recurso.constructor.name);

        // Obtengo la referencia REST de tal clase
        return resourcesREST[
            Object.keys(resourcesREST).find(key => resourcesREST[key].Clase === ClaseRecurso)
        ].nombre;
    }

    /**
     * A partir de un recurso, retorna el nombre de la key que alberga el id de este recurso
     * Ejemplo: recurso (instnacia de Producto) -> retorna 'idProductos'
     */
    getNameIdKeyOfResource = (recurso) => {
        // Obtengo la primer key de la clase del recurso recibido
        const idRecurso = Object.keys(recurso)[0];
        const id = `${idRecurso[0]}${idRecurso[1]}`;
        const cod = `${idRecurso[0]}${idRecurso[1]}${idRecurso[2]}`;
        // Checkeo si NO es un id o un codigo
        if (id !== 'id' && cod !== 'cod' && !idRecurso.toLowerCase().includes('codigo')) {
            const realIdOrCod = Object.keys(recurso).find(key => {
                // descarto casos particulares
                if (key === 'idFactCabImputada' || key === 'idFactDetalleImputa') {
                    return false;
                }

                const id = `${key[0]}${key[1]}`;
                const tercerCaracter = key[2]
                const cod = `${key[0]}${key[1]}${key[2]}`;
                const cuartoCaracter = key[3]
                return  (id === 'id' && tercerCaracter === tercerCaracter.toUpperCase()) ||
                        (cod === 'cod' && cuartoCaracter === cuartoCaracter.toUpperCase())
            });
            // debugger;
            return realIdOrCod;
        } else {
            // debugger;
            return idRecurso;
        }

    }

    upperFirstLetter = (rrr) => `${rrr[0].toUpperCase()}${rrr.substring(1)}`


    /**
     * Se usa en las listas desplegables, te agarra el item definido en el recurso cuando se edita un recurso
     * @param item1
     * @param item2
     */
    dropdownCompareWith(item1: any, item2: any, idKeyName?) {
        const idRecurso1 = item1 ? Object.keys(item1)[0] : null;
        const idRecurso2 = item2 ? Object.keys(item2)[0] : null;
        return idRecurso1 && idRecurso2 ? item1[idRecurso1] === item2[idRecurso2] : null;
        
    }
    // dropdownCompareWith = (keyId?) => (item1: any, item2: any) => {
    //     debugger;
    //     if (item1 && item2) {
    //         if (keyId) {
    //             return item1[keyId] === item2[keyId]
    //         } else {
    //             const idRecurso1 = item1 ? Object.keys(item1)[0] : null;
    //             const idRecurso2 = item2 ? Object.keys(item2)[0] : null;
    //             return idRecurso1 && idRecurso2 ? item1[idRecurso1] === item2[idRecurso2] : null;
    //         }
    //     }
    // }

    /**
     *
     */
    dateToString = (fechaDate) => {
        // return `${fechaDate.year}-${fechaDate.month}-${fechaDate.day}`
        return `${fechaDate.day}/${fechaDate.month}/${fechaDate.year}`
    }

    /**
     * Retorna la posicion de un elemento dom dado
     * @param el
     */
    getOffset( el ) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        // Le resto el scrolltop de la ventana completa
        _y -= document.documentElement.scrollTop;

        return { top: _y, left: _x };
    }

    /**
     * Retorna el tipo de datos
     */
    getTipoDato = (dato) => (dato && dato.constructor && dato.constructor.name) ?
        dato.constructor.name : null;


    /**
     * Dado un string en formato ddmm retorna dd/mm/aaaa en typeData DateLikePicker, o null en caso de formato incorrecto
     * Si es formato dd/mm/aaaa, tambien retoron un datelikepicker
     */
    stringToDateLikePicker = (valueFecha) => {
        //debugger;
        return valueFecha && 
        valueFecha.length === 4 && 
        /^\d+$/.test(valueFecha) ? // Todos numeros
            new DateLikePicker(null, {
                day: Number(valueFecha.substring(0, 2)),
                month: Number(valueFecha.substring(2)),
                year: (new Date()).getFullYear()
            }) 
            :
            valueFecha && 
            valueFecha.day && 
            valueFecha.month ?
                new DateLikePicker(null, valueFecha)
                :
                null
    }

    /**
     * Decodifica la respuesta del error (scando el _body) y muestra el mensaje
     */
    showErrorWithBody = (err: any, isInnerHTML?, onClickEvent?) => {
        
        const theBody =
            err && err['_body'] ?
                (typeof err['_body'] === 'object') ?
                    err['_body'] : JSON.parse(err['_body']) : 
                null;

        this.showModal(
            theBody && theBody.control ?
                theBody.control.codigo : 'Error'
        )(
            theBody && theBody.control ?
                theBody.control.descripcion : 'Error de red'
        )(onClickEvent)(null, null, isInnerHTML)
    }

    /**
     * Obtengo una instancia vacia la clase correspondiente a un recurso dado
     */
    getInstanciaVacia = (recursoRest) => recursoRest && recursoRest.Clase ? new recursoRest.Clase() : null;



    formatearFecha = (formato) => (fecha) => {
        if (fecha && fecha.year) {
            if (formato === 'yyyy-mm-dd') {
                return `${fecha.year}-${fecha.month < 10 ? '0'+fecha.month:fecha.month}-${fecha.day < 10 ? '0'+fecha.day : fecha.day}`;
            } else {
                return `${fecha.day < 10 ? '0'+fecha.day : fecha.day}-${fecha.month < 10 ? '0'+fecha.month:fecha.month}-${fecha.year}`;
            }
        } else {
            return moment.utc(fecha).format(
                formato ? formato.toUpperCase() : 'YYYY-MM-DD'
            )
        }

    }


    // Flatmap para arrays
    flatMap = (f, arr) =>
        arr.reduce((x, y) => [...x, ...f(y)], [])

    parseDecimal = (key: number) => {
        const nro = (Math.round(key * 100) / 100).toFixed(2);
        const value = Number(nro);
        if (nro) {
            return value.toLocaleString('en-EN');
            // return Number.parseFloat(key).toFixed(2);
        } else {
            return "0.00";
        }
    }

    parseDecimalToThree = (key: number) => {
        const nro = (Math.round(key * 100) / 100).toFixed(3);
        const value = parseFloat(nro);
        if (nro) {
            return nro;
            // return Number.parseFloat(key).toFixed(2);
        } else {
            return "0.00";
        }
    }

    parseDecimalNumber = (key: number) => {
        const nro = (Math.round(key * 100) / 100).toFixed(2);
        if (nro) {
           return this.toLocateString(nro);
            // return Number.parseFloat(key).toFixed(2);
        } else {
            return 0;
        }
    }

    // toLocateString = (num) => num.toLocaleString('en-GB', { maximumSignificantDigits: 3 })
    toLocateString = (num) => num.toLocaleString()
    toLocateString2 = (num) => num.toLocaleString('en-IN')

    toFixedTrunc = (num, fixed) => {
        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }

    /**
     * Trunca hasta 3
     */
    toTrunc3 = (key) => {
        const nro = Number.parseFloat(key);

        if (nro) {
            return this.toFixedTrunc(Number.parseFloat(key), 3);
        } else {
            return 0;
        }
    }

    /**
     * Pasa de datelikepiker a Date
     */
    dateLikePickerToDate = (fecha: DateLikePicker) => {
        let newFecha = new Date();
        if (fecha && fecha.day) {
            // Se le resta 1 porque js cuenta meses desde 0 en adelante
            newFecha.setFullYear(fecha.year, fecha.month - 1, fecha.day);
            return newFecha;
        } else {
            return null;
        }
    }

    checkIfJson = (obj) => (obj && typeof obj === 'object');

    

    /**
     * Check if document element has a determinate class
     * @param ele
     * @param cls
     */
    hasClass(ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }


    compareWithAbsolut = (item1: any, item2: any) => {
        // if (item2 && item2 !== '21012200') debugger;
        return item1 && item2 && (
            item1 === item2 ||
            item1.toString() === item2
        )
    }


    validarCuit = (inputValor) => {
        
        var inputString = inputValor.toString()
        if (inputString.length == 11) {
            var Caracters_1_2 = inputString.charAt(0) + inputString.charAt(1)
            if (Caracters_1_2 == "20" || Caracters_1_2 == "23" || Caracters_1_2 == "24" || Caracters_1_2 == "27" || Caracters_1_2 == "30" || Caracters_1_2 == "33" || Caracters_1_2 == "34") {
                var Count = inputString.charAt(0) * 5 + inputString.charAt(1) * 4 + inputString.charAt(2) * 3 + inputString.charAt(3) * 2 + inputString.charAt(4) * 7 + inputString.charAt(5) * 6 + inputString.charAt(6) * 5 + inputString.charAt(7) * 4 + inputString.charAt(8) * 3 + inputString.charAt(9) * 2 + inputString.charAt(10) * 1;
                var Division = Count / 11;
                if (Division == Math.floor(Division)) {
                    return true
                }
            }
        }
        return false 
    }

    auxStringify = (obj) => JSON.stringify(obj);


    prettyDate = (theDate) => {
        let mutTheDate = theDate;
        if (!theDate.getDate) {
            mutTheDate = this.dateLikePickerToDate(theDate);
        }
        const day = mutTheDate.getDate();
        const month = mutTheDate.getMonth() + 1;
        const year = mutTheDate.getFullYear();
        return `${day<10 ? '0' : ''}${day}/${month<10 ? '0' : ''}${month}/${year}`
    }

    /**
     * Autocompleta con ceros
     */
    autocompNroComp = (tipo) => (recursoComp) => {
        // debugger;
        return recursoComp && recursoComp[tipo] ?
            recursoComp[tipo].padStart(
                (
                    tipo === 'puntoVenta' ||
                    tipo === 'ptoVenta'
                ) ? 4 : 8,
                0
            ) : '';
    }

    focusElement = (idElement) => document.getElementById('idBtnConfirmar') ? document.getElementById('idBtnConfirmar').focus() : null

    downloadBlob = (bodyResp, name, formato?) => {
        // const bodyResp = resp['_body'];

        var newBlob = new Blob([bodyResp], {type: formato ? formato : "application/pdf"})
        

        // IE
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        } 
        
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        // link.download="fileBody.pdf";
        link.download=`${name}.${formato ? 'docx' : 'pdf'}`;
        link.click();

        // Firefox
        setTimeout(function(){
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
        }, 100);
    }

    // saveByteArray = (function () {
    //     var a = document.createElement("a");
    //     document.body.appendChild(a);

    //     return function (data, name) {
    //         var blob = new Blob(data, {type: "octet/stream"}),
    //             url = window.URL.createObjectURL(blob);
    //         a.href = url;
    //         a.download = name;
    //         a.click();
    //         window.URL.revokeObjectURL(url);
    //     };
    // }());

    numeroObjectToString = (numerador: Numerador) => 
        numerador && numerador.ptoVenta && numerador.numerador ?
            `${numerador.ptoVenta.ptoVenta.toString().padStart(4, '0')}${numerador.numerador.toString().padStart(8, '0')}` :
            `XXXXXXXXXXXX`
    

    filtrarPadrones = (listaPadrones, textoBuscado) => 
        listaPadrones.filter(
            (prov: Padron) =>   prov.padronCodigo.toString().includes(textoBuscado) ||
                                prov.padronApelli.toString().toLowerCase().includes(textoBuscado)
        );

    /**
     * Retorna true si un elemento está focuseado actualmente
     */
    ifFocused = (el) => 
        document.activeElement && el ? document.activeElement.id === el.id : false

    compareWithSimple = (a, b) => a && b && a === b

    /**
     * Retorna el menu actual (matcheando ruta actual con menus del localStorage)
     * TODO: Por ahora solo ABMs
     */
    getCurrentMenu = () => {
        if (window && window.location && window.location.href) {
            // Busco ruta actual
            const rutaActual = window.location.href
                .substring(
                    window.location.href.indexOf('tablas') 
                    + 'tablas'.length 
                    + 1
                )
            // Agarro solo los menu de abm
            const abmMenus = this.localStorageService.getAbmMenus();
            // Matcheo agarrando el current menu
            const currentMenu = abmMenus.find(abm => abm.path === rutaActual);
            return currentMenu;
        } else {
            return null;
        }
    }
    
    /**
     * Dada una key retorna un compareWith generico donde compara las dos key de los dos objetos
     */
    compareWithGeneric = (keyToCompare) => (a, b) => a && b && a[keyToCompare] && b[keyToCompare] ?
        a[keyToCompare] === b[keyToCompare] : null

    /**
     * Se fija si es un numero valido. Si NO es, entonces enfoca de nuevo o limpia el input
     */
    onBlurInputNumber = (ev) => {
        const currentValue = ev && ev.currentTarget ? 
            Number(ev.currentTarget.value) : null;

        // Si NO es un numero..
        if (Number.isNaN(currentValue)) {
            ev.currentTarget.focus();
            return false
        } else {
            return true
        }
    }

    generarClaveNC = (ptoVenta, nroComprobante, codigoPadron) => {
        const fecha = new Date();
        const dia = fecha.getDate();
        const month = fecha.getMonth() + 1;
        const year = fecha.getFullYear();
        const calc = Math.floor((dia * month * year) * (ptoVenta + nroComprobante + codigoPadron) / 123);
        const calcString = calc.toString();
        const result = calcString.substr(calcString.length - 4);
        return result;
    }

    /**
     * 3 decimales
     */
    toThreeDecimals = (num) => 
        num.toLocaleString('en', { minimumFractionDigits:3, useGrouping:false })


    parseBody = (resp) => resp && resp['_body'] ?
        (typeof resp['_body'] === 'object') ?
            resp['_body'] : JSON.parse(resp['_body']) : null;
}
