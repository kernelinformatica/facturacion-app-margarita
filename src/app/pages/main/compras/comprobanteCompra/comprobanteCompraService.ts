import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { Padron } from "../../../../models/padron";
import { AuthService } from "app/services/authService";
import { LocalStorageService } from "app/services/localStorageService";
import { environment } from "environments/environment";
import { ProductoPendiente } from "../../../../models/productoPendiente";
import { RecursoService } from "app/services/recursoService";
import { resourcesREST } from "constantes/resoursesREST";
import { Cotizacion } from "app/models/cotizacion";
import { ProductoBuscaModelo } from "../../../../models/productoBuscaModelo";
import { ModeloFactura } from "../../../../models/modeloFactura";
import { Comprobante } from "app/models/comprobante";
import { ComprobanteRelacionado } from "app/models/comprobanteRelacionado";
import { Observable } from 'rxjs/Observable';
import { Deposito } from '../../../../models/deposito';
import { UtilsService } from '../../../../services/utilsService';
import { FormaPago } from "app/models/formaPago";
import { DetalleFormaPago } from "app/models/detalleFormaPago";
import { Factura } from '../../../../models/factura';
import { SisTipoOperacion } from '../../../../models/sisTipoOperacion';
import sisModulos from 'constantes/sisModulos';

@Injectable()
export class ComprobanteCompraService {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private recursoService: RecursoService,
        public utilsService: UtilsService
    ) { }

    filtrarProveedores = (listaProveedores, textoBuscado) => {
        return listaProveedores.filter(
            (prov: Padron) =>   prov.padronCodigo.toString().includes(textoBuscado) ||
                                prov.padronApelli.toString().toLowerCase().includes(textoBuscado)
        );
    }

    getProveFormated = (prove) => `${prove.padronNombre} (${prove.padronCodigo})`;

    getColumnsProductos = () => [
       
        {
            nombre: 'articulo',
            key: 'producto',
            subkey: 'codProducto',
            ancho: '20%'
        },
        {
            nombre: 'item',
            key: 'producto',
            subkey: 'item',
            ancho: '5%'
         
        },
        {
            nombre: 'descripcion',
            key: 'producto',
            subkey: 'descripcion',
            ancho: '17%',
            customClass: 'text-left'
        },
        {
            nombre: 'imputacion',
            key: 'imputacion',
            ancho: '8%',
            enEdicion: null,
            customClass: 'text-left',
            editarFocus: true
        },
        {
            nombre: 'precio',
            key: 'precio',
            ancho: '10%',
            enEdicion: null,
            decimal: true,
            customClass: 'text-right',
            customBlur: 'calculateImporte'
        },
        {
            nombre: 'ivaPorc',
            key: 'ivaPorc',
            ancho: '10%',
            decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: 'cantidad',
            key: 'pendiente',
            ancho: '10%',
            enEdicion: null,
            decimal: true,
            customClass: 'text-right',
            customBlur: 'calculateImporte'
        },
        {
            nombre: 'importe',
            key: 'importe',
            ancho: '15%',
            enEdicion: null,
            decimal: true,
            customClass: 'text-right',
            elementoFinalBlur: true
        },
        {
            nombre: 'trazable',
            key: 'producto',
            subkey: 'trazable',
            ancho: '5%',
            customClass: 'text-left'
        },
        {
            nombre: 'Nro Comprobante',
            key: 'numero',
            ancho: '5%',
            customClass: 'text-left'
        }
    ];

    getColumnsTrazabilidad = () => [
        {
            nombre: 'item',
            key: 'producto',
            subkey: 'item',
            ancho: '5%'
           
        },
        {
            nombre: 'articulo',
            key: 'producto',
            subkey: 'codProducto',
            ancho: '5%'
        },
        {
            nombre: 'descripcion',
            key: 'producto',
            subkey: 'descripcion',
            ancho: '15%'
        },
        {
            nombre: 'GLN',
            key: 'trazabilidad',
            subkey: "gln",
            ancho: '5%',
            enEdicion :null,
            editarFocus: true
        },
        {
            nombre: 'lote',
            key: 'trazabilidad',
            subkey: 'lote',
            ancho: '5%',
            enEdicion: null,
            editarFocus: true
        },
        {
            nombre: 'serie',
            key: 'trazabilidad',
            subkey: 'serie',
            ancho: '20%',
            enEdicion: null
        },
        {
            nombre: 'fecha elab',
            key: 'trazabilidad',
            subkey: 'fechaElab',
            ancho: '20%',
            enEdicion: null
        },
        {
            nombre: 'fecha vto',
            key: 'trazabilidad',
            subkey: 'fechaVto',
            ancho: '20%',
            enEdicion: null
        },
        {
            nombre: 'Nro Comprobante',
            key: 'numero',
            ancho: '5%',
            customClass: 'text-left'
        }
    ];

    getColumnsFactura = () => [
        {
            nombre: 'cuenta',
            key: 'cuentaContable',
            ancho: '30%'
        },
        {
            nombre: 'descripción',
            key: 'descripcion',
            ancho: '30%'
        },
        {
            nombre: 'base imponible',
            key: 'baseImponible',
            ancho: '30%',
            decimal: true
        },
        {
            nombre: 'importe',
            key: 'importeTotal',
            ancho: '30%',
            decimal: true,
            enEdicion: null,
            customClass: 'text-right',
            editarFocus: true,
            elementoFinalBlur: true
        }
    ]

    getColumnsFacturaDolares = () => [
        {
            nombre: 'cuenta',
            key: 'cuentaContable',
            ancho: '25%'
        },
        {
            nombre: 'descripción',
            key: 'descripcion',
            ancho: '25%'
        },
        {
            nombre: 'base imponible',
            key: 'baseImponible',
            ancho: '25%',
            decimal: true
        },
        {
            nombre: 'importe',
            key: 'importeTotal',
            ancho: '25%',
            decimal: true,
            enEdicion: null,
            customClass: 'text-right',
            editarFocus: true,
            elementoFinalBlur: true
        },
        {
            nombre: 'importe AR$',
            key: 'importeArs',
            ancho: '25%',
            decimal: true,
            customClass: 'text-right, padding-left4em'
        }
    ]

    /**
     * Buscar los productos pendientes
     */
    buscarPendientes = (proveedor: Padron) => (comprobanteRel: ComprobanteRelacionado) => (comprobante: Comprobante) => (tipoOpSelect: SisTipoOperacion) =>
        this.authService.getProductosPendientes(
                this.localStorageService.getObject(environment.localStorage.acceso).token
            )(
                proveedor
            )(
                comprobanteRel
            )(
                comprobante
            )(
                tipoOpSelect
            )(null)(sisModulos.compra)()()()()
            .map(
                respuesta => respuesta.arraydatos.map(
                    prodPend => new ProductoPendiente(prodPend)
                )
            );


    /**
     * Retorna todos los productos de la empresa actual
     */
    getAllProductos = () => this.recursoService.getRecursoList(resourcesREST.productos)();


    /**
     * Retorna un array de solo los prodPendientes que son trazables
     */
    getOnlyTrazables = (prodsPend: ProductoPendiente[]) => {
        return prodsPend.filter(prod => prod.producto.trazable);
    }

    /**
     * Retorna los datos de cotizacion
     */
    getCotizacionDatos = () => this.authService.getCotizacion(
        this.localStorageService.getObject(environment.localStorage.acceso).token
    ).map(responseCotiz => new Cotizacion(responseCotiz.datos));

    /**
     * Retorna un array de todas las letras (del iva) del proovedr seleccionado
     */
    // getLetrasProveedor = (proveSelec: Padron) => this.authService.getSisSitIva(
    //     this.localStorageService.getObject(environment.localStorage.acceso).token
    // )(proveSelec).map(
    //     respSisIva => respSisIva.datos.letra.split(',')
    // )

    /**
     * Busca modelos para tab facturacion
     */
    buscaModelos = (prodsPend: ProductoPendiente[], idMoneda, idProveedor) => {
        const prodsModel = prodsPend.map(prodP => new ProductoBuscaModelo(
            {
                idProducto: prodP.producto.idProductos,
                /*precio: Number(prodP.precio),
                cantidad: prodP.pendiente
                La razòn por la que está comentado el procedimiento "correcto" es que si el usuario
                hace una modificación del importe y no de la cantidad o el precio unitario del producto
                este no se verá reflejado en ninguna de esas dos propiedades, por lo cual precio * cantidad != importe
                Esto causaba que la base de imputación no cambie, por ahora se utiliza esta forma, en futuras versiones
                debemos cambiar el servicio rest para que reciba solo el importe, no el precio y la cantidad*/
                precio: Number(prodP.importe),
                cantidad: 1
            }
        ));

        return this.authService.buscaModelos(
            this.localStorageService.getObject(environment.localStorage.acceso).token, 
            prodsModel, 
            1, 
            idMoneda, 
            idProveedor)
                .map(
                    responBuscMod => responBuscMod.arraydatos.map(
                        respModFact => new ModeloFactura(respModFact)
                    )
                );
    }

    /**
     *
     */
    
    confirmarYGrabarComprobante = (comprobante: Comprobante) =>
        (comproRelac: ComprobanteRelacionado) =>
        (provSelec: Padron) =>
        (productosPend: ProductoPendiente[]) =>
        (modelosFactura: ModeloFactura[]) =>
        (cotizacionDatos: { cotizacion: Cotizacion, total: number }) =>
        (depositoSelec: Deposito) =>
        (detallesFormaPago: DetalleFormaPago[]) => 
        // (factura: Factura) => 
        (factura: Comprobante) => 
        (tipoOpSelect: SisTipoOperacion) => 
        (pesificado: boolean) => 
        (dolarizadoAlVto: boolean) => 
        (interesMensualCompra: number) => 
        (canjeInsumos: boolean) => 
        (tipoCambio: string) => 

            this.authService.grabaComprobante(this.localStorageService.getObject(environment.localStorage.acceso).token)(comprobante)(comproRelac)(provSelec)(productosPend)(modelosFactura)(cotizacionDatos)(depositoSelec)(detallesFormaPago)(factura)(tipoOpSelect)(pesificado)(dolarizadoAlVto)(interesMensualCompra)(canjeInsumos)(tipoCambio)
                .catch(
                    err => {
                        this.utilsService.decodeErrorResponse(err);
                        return Observable.throw(null)
                    }
                )
        

    /**
     * Valida que los datos estén correctos
     */
    
     checkIfDatosValidosComprobante =   (comprobante: Comprobante) =>
                                (provSelec: Padron) =>
                                (productosPend: ProductoPendiente[]) =>
                                (modelosFactura: ModeloFactura[]) =>
                                (depositoSelec: Deposito) => {
        // Primero checkeo nulos
        const noExistenNulos = this.checkIfNulosDatosComprobantes(comprobante)(provSelec)(productosPend)(modelosFactura)(depositoSelec);
                               
        // Checkeo que haya productos agregados
        const existenProductos = this.checkIfExistenProductos(productosPend);
        /// Checkeo que hayan cargado los datos de la trazabilidad (y que el tipo comprobatne NO sea Ordencompra, ni factura de compra)
            const trazabilidadCargada = 
            comprobante && comprobante.tipo && comprobante.tipo.comprobante /*&& comprobante.tipo.comprobante.idSisComprobantes === 2*/  ||
            this.checkIfTrazabilidadCargada(productosPend);
        // Si se seleccionó alguna forma de pago, entonces checkeo que los importes estén seteados y totalicen el total del comprobante
        // const impFpTotalizanTotalComp = this.checkIfImpFpTotalizanTotalComp(detallesFormaPago)(totalCotizacion)(sumatoriaSubtotales);


        // Si no existen nulos y si existen productos, los datos son validos
        // return noExistenNulos && existenProductos && trazabilidadCargada && impFpTotalizanTotalComp
        
        return noExistenNulos && existenProductos && trazabilidadCargada  ;
        
    }

    /**
     * Si se seleccionó alguna forma de pago, entonces checkeo que los importes estén seteados y totalicen el total del comprobante
     */
    checkIfImpFpTotalizanTotalComp = (detallesFormaPago: DetalleFormaPago[]) => (totalCotizacion: number) => (sumatoriaSubtotales: number) => {
        if (detallesFormaPago && detallesFormaPago.length > 0) {
            const sumMontos = _.sumBy(
                detallesFormaPago,
                (fPago) => Number(fPago.monto) ? Number(fPago.monto) : 0
            )
    
            const restoPagar = (totalCotizacion + sumatoriaSubtotales) - sumMontos

            return (restoPagar && restoPagar === 0)
        } else {
            return false
        }
    }
    
    /**
     * 
     * Checkeo que lso datos de trazabilidad esten cargados en los productos trazables
     */
    
    checkIfTrazabilidadCargada = (productosPend: ProductoPendiente[]) => productosPend
        .filter(prodPend => prodPend.producto.trazable)
        .every( prod => (prod.trazabilidad && 
                prod.trazabilidad.gln && 
                prod.trazabilidad.lote && 
                prod.trazabilidad.serie && 
                prod.trazabilidad.fechaVto && 
                prod.trazabilidad.fechaElab)
                ? true: false
        )
    
        
    /**
     * Me fijo si hay productos agregados
     */
    checkIfExistenProductos = (productosPend: ProductoPendiente[]) => (
        productosPend.length > 0
    )
    // checkIfExistenProductos = (productosPend: ProductoPendiente[]) => (modelosFactura: ModeloFactura[]) => (
    //     productosPend.length > 0 &&
    //     modelosFactura.length > 0
    // )

    /**
     * Checkea si existen nulos
     * @return TRUE si NO hay nulos
     */
    checkIfNulosDatosComprobantes =   (comprobante: Comprobante) =>
                                    (provSelec: Padron) =>
                                    (productosPend: ProductoPendiente[]) =>
                                    (modelosFactura: ModeloFactura[]) =>
                                    (depositoSelec: Deposito) => (
        provSelec.padronCodigo &&
        comprobante &&
        comprobante.tipo &&
        comprobante.tipo.idCteTipo &&
        comprobante.letraCodigo &&
        comprobante.numerador.ptoVenta &&
        comprobante.numerador.ptoVenta.ptoVenta &&
        comprobante.moneda &&
        comprobante.moneda.idMoneda &&
        comprobante.fechaComprobante &&
        comprobante.fechaVto &&
        comprobante.fechaContable &&
        productosPend &&
        modelosFactura &&
        depositoSelec
        
    )
    
    // throw({
    //     nombreError: 'Error',
    //     descripcionError: 'Debe ingresar 4 caracteres o menos'
    // })
    /**
     * Autocompleta con ceros
     */
    autocompNroComp = (tipo) => (recursoComp) => recursoComp && recursoComp[tipo] ?
        recursoComp[tipo].padStart(
            tipo === 'puntoVenta' ? 4 : 8,
            0
        ) : '';


    seleccionarProveedor = (todos: Padron[]) => (seleccionado: Padron) => {
        // Primero busco si el ingresado existe
        const provBuscado = new Padron({...todos.find(
            prove => prove.padronCodigo === Number(seleccionado.padronCodigo)
        )});

        // Si existe, lo seteo como seleccionado
        if (provBuscado) {
            return provBuscado;
        } else {
            // Caso contrario..
            // Busco el padronCodigo del proveedor que estaba seleccionado
            const proveedorAnterior: Padron = new Padron({...todos.find(
                prove =>    prove.padronApelli === seleccionado.padronApelli &&
                            prove.padronNombre === seleccionado.padronNombre &&
                            prove.cuit === seleccionado.cuit &&
                            prove.codigoPostal === seleccionado.codigoPostal
            )});

            // Si habia uno seleccionado, lo restauro
            if (proveedorAnterior) {
                // Vuelvo el padronCodigo a su valor correcto
                return proveedorAnterior;
            } else {
                // Caso contrario tiro mensajito
                throw({
                    nombre: 'Codigo incorrecto',
                    descripcion: 'El codigo no existe'
                })

            }
        }
    }


    /**
     * Get formas pago apra la tabla de forma pago
     */
    getFormasPago = (fecha: any) => 
        this.authService.getBuscaFormaPago(this.localStorageService.getObject(environment.localStorage.acceso).token)()(fecha)
            .map(resp => resp.arraydatos.map(fp => new FormaPago(fp)))
            .catch((err, caught) => {
                // debugger;
                this.utilsService.showErrorWithBody(err);
                return Observable.of([]);
            })


    getColumnsDetallesFp = () => [
        {
            nombre: 'forma pago',
            key: 'formaPagoDescrip',
            ancho: '15%'
        },
        {
            nombre: 'plazo',
            key: 'cantDias',
            ancho: '15%',
            customClass: 'text-right'
        },
        {
            nombre: 'int',
            key: 'porcentaje',
            ancho: '15%',
            decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: 'detalle',
            key: 'detalle',
            ancho: '15%',
            customClass: 'text-left'
        },
        {
            nombre: 'monto',
            key: 'monto',
            ancho: '15%',
            enEdicion: null,
            editarFocus: true,
            decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: 'observaciones',
            key: 'observaciones',
            ancho: '30%',
            enEdicion: null,
            elementoFinalBlur: true,
            customClass: 'text-left'
        }
    ]

    /**
     * Checkea si hay cambios cuando intenta salir del componente
     */
    checkPendingChanges = (comprobante) => (factura) => (proveedorSeleccionado) => (comprobanteRelacionado) => {    
        // En el comprobante y la factura no checkeo la fecha porque complica mucho el procezo de isEqual
        const compEdit = _.omit(
            Object.assign({}, comprobante),
            ['fechaComprobante', 'fechaVto']
        )
        const compOrigi = _.omit(
            Object.assign({}, new Comprobante()),
            ['fechaComprobante', 'fechaVto']
        )
        
        
        const factEdit = _.omit(
            Object.assign({}, factura),
            ['fechaContable', 'fechaVto']
        )
        const factOrigi = _.omit(
            Object.assign({}, new Comprobante()),
            ['fechaContable', 'fechaVto']
        )

        // const t = _.omit(
        //     Object.assign({}, new Padron()),
        //     ['padronCodigo']
        // );
        // const t0 = _.omit(
        //     Object.assign({}, proveedorSeleccionado),
        //     ['padronCodigo']
        // )

        return (
            _.isEqual(
                _.omit(
                    Object.assign({}, proveedorSeleccionado),
                    ['padronCodigo']
                ),
                _.omit(
                    Object.assign({}, new Padron()),
                    ['padronCodigo']
                )
            ) && 
            _.isEqual(
                compEdit, 
                compOrigi
            ) &&
            _.isEqual(
                Object.assign({}, comprobanteRelacionado),
                Object.assign({}, new ComprobanteRelacionado())
            ) &&
            _.isEqual(
                factEdit, 
                factOrigi
            )
        )
    }


    
    /**
     * Busca un producto en la base, por su ID
     */
    buscarProducto = (idProducto, idMoneda) =>
        this.authService.getBuscarProducto(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(idProducto)()(idMoneda)()()()()()()
            .map(
                respProdEnc => respProdEnc && respProdEnc.arraydatos && respProdEnc.arraydatos.length > 0 ?
                    new ProductoPendiente(respProdEnc.arraydatos[0]) : null
            )   


    /**
     * Checkea si el proveedor existe en la db de facturación
     */
    checkIfProvExistInFacturacion = (prov: Padron) => 
        this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.proveedores.nombre
        )({
            codProveedor: prov.padronCodigo
        })('query')
        .toPromise()


}
