import { Usuario } from "app/models/usuario";
import { TipoComprobante } from "app/models/tipoComprobante";
import { Rubro } from "app/models/rubro";
import { Perfil } from "app/models/perfil";
import { Sucursal } from "app/models/sucursal";
import { SubRubro } from "app/models/subRubro";
import { FormaPago } from "app/models/formaPago";
import { TipoFormaPago } from "app/models/tipoFormaPago";
import { Producto } from "app/models/producto";
import { IVA } from "app/models/IVA";
import { Unidad } from "app/models/unidad";
import { Deposito } from "app/models/deposito";
import { ListaPrecio } from "app/models/listaPrecio";
import { Moneda } from "app/models/moneda";
import { SisComprobante } from "app/models/sisComprobante";
import { Padron } from "app/models/padron";
import { SisTipoOperacion } from "app/models/sisTipoOperacion";
import { ProductoPendiente } from "app/models/productoPendiente";
import { Parametro } from "app/models/parametro";
import { Cotizacion } from "app/models/cotizacion";
import { ProductoBuscaModelo } from "app/models/productoBuscaModelo";
import { SisModulo } from "../app/models/sisModulo";
import { SisEstado } from "app/models/sisEstado";
import { CondIva } from "app/models/condIva";
import { CteFechas } from "app/models/cteFechas";
import { SisCanje } from "app/models/sisCanje";
import { Lote } from "app/models/lote";
import { ModeloCab } from "app/models/modeloCab";
import { Stock } from "app/pages/main/stock";
import { PlanCuenta } from "app/models/planCuenta";
import { SisTipoModelo } from "app/models/sisTipoModelo";
import { ModeloCabSinDetalles } from "app/models/modeloCabSinDetalles";
import { CodigoAfip } from "app/models/codigoAfip";
import { Marca } from "app/models/marca";
import { ProductoReducido } from "app/models/productoReducido";
import { Numerador } from "app/models/numerador";

import { Categoria } from "app/models/categoria";
import { SisCategoria } from "app/models/sisCategoria";
import { Cliente } from "app/models/cliente";
import { SisSitIVA } from "app/models/sisSitIVA";
import { ClienteModPost } from "app/models/clienteModPost";
import { Cultivo } from "app/models/cultivo";
import { SisLetra } from "app/models/sisLetra";
import { Vendedor } from "app/models/vendedor";
import { PtoVenta } from "app/models/ptoVenta";
import { LetraCodigo } from "app/models/letraCodigo";
import { Contrato } from "app/models/contrato";
import { Libro } from "app/models/libro";
import { Proveedor } from "app/models/proveedor";
import { RelacionCanje } from "app/models/relacionCanje";
import { SisCotDolar } from "app/models/sisCotDolar";
import { TiposOpDepositos } from "app/models/tiposOpDepositos";
import { CanjesContratosCereales } from "app/models/canjesContratosCereales";
import { EstadoSisa } from "app/models/estadoSisa";
import { Cereales } from "app/models/cereales";
import { ParametrosCanje } from "app/models/parametrosCanje";

/**
 * Todos los recursos disposnibles en el serivcio REST
 */
export const resourcesREST = {
    usuarios: {
        nombre: 'usuarios',
        Clase: Usuario
    },
    cteTipo: {
        nombre: 'cteTipo',
        Clase: TipoComprobante
    },
    rubros: {
        nombre: 'rubros',
        Clase: Rubro
    },
    perfiles: {
        nombre: 'perfiles',
        Clase: Perfil
    },
    sucursales: {
        nombre: 'sucursales',
        Clase: Sucursal
    },
    subRubros: {
        nombre: 'subRubros',
        Clase: SubRubro
    },
    formaPago: {
        nombre: 'formaPago',
        Clase: FormaPago
    },
    sisFormaPago: {
        nombre: 'sisFormaPago',
        Clase: TipoFormaPago
    },
    productos: {
        nombre: 'productos',
        Clase: Producto
    },
    productosReducidos: {
        nombre: 'productos',
        Clase: ProductoReducido
    },
    sisIVA: {
        nombre: 'sisIVA',
        Clase: IVA
    },
    sisUnidad: {
        nombre: 'sisUnidad',
        Clase: Unidad
    },
    depositos: {
        nombre: 'deposito',
        Clase: Deposito
    },
    listaPrecios: {
        nombre: 'listaPrecios',
        Clase: ListaPrecio
    },
    sisMonedas: {
        nombre: 'sisMonedas',
        Clase: Moneda
    },
    filtroListaPrecios: {
        nombre: 'filtroListaPrecios',
        Clase: Producto
    },
    sisComprobantes: {
        nombre: 'sisComprobantes',
        Clase: SisComprobante
    },
    padron: {
        nombre: 'padron',
        Clase: Padron
    },
    sisTipoOperacion: {
        nombre: 'sisTipoOperacion',
        Clase: SisTipoOperacion
    },
    buscaPendientes: {
        nombre: 'buscaPendientes',
        Clase: ProductoPendiente
    },
    buscaCotizacion: {
        nombre: 'buscaCotizacion',
        Clase: Cotizacion
    },
    buscaModelo: {
        nombre: 'buscaModelo',
        Clase: ProductoBuscaModelo
    },
    sisModulos: {
        nombre: 'sisModulos',
        Clase: SisModulo
    },
    sisEstados: {
        nombre: 'sisEstados',
        Clase: SisEstado
    },
    buscaComprobantes: {
        nombre: 'buscaComprobantes',
        Clase: null
    },
    buscaComprobantesAnticipados: {
        nombre: 'buscaComprobantesAnticipados',
        Clase: null
    },
    // buscaCteTipoNro: {
    //     nombre: 'buscaCteTipoNro',
    //     Clase: TipoComprobante
    // },
    buscaFormaPago: {
        nombre: 'buscaFormaPago',
        Clase: null
    },
    sisSitIva: {
        nombre: 'sisSitIva',
        Clase: SisSitIVA
    },
    buscaCteFecha: {
        nombre: 'buscaCteFecha',
        Clase: null
    },
    calculoSubtotales: {
        nombre: 'calculoSubtotales',
        Clase: null
    },
    sisCanjes: {
        nombre: 'sisCanjes',
        Clase: SisCanje
    },
    buscaLote: {
        nombre: 'buscaLote',
        Clase: Lote
    },
    buscaLotes: {
        nombre: 'buscaLotes',
        Clase: Lote
    },
    modeloCab: {
        nombre: 'modeloCab',
        Clase: ModeloCabSinDetalles
    },
    buscaStock: {
        nombre: 'buscaStock',
        Clase: Stock
    },
    modeloImputacion: {
        nombre: 'modeloImputacion',
        Clase: ModeloCab
    },
    contPlanCuenta: {
        nombre: 'contPlanCuenta',
        Clase: PlanCuenta
    },
    sisTipoModelo: {
        nombre: 'sisTipoModelo',
        Clase: SisTipoModelo
    },
    proximoCodigo: {
        nombre: 'proximoCodigo',
        Clase: String
    },
    // compGest: {
    //     nombre: 'compGest',
    //     Clase: CodigoAfip
    // },
    sisCodigoAfip: {
        nombre: 'sisCodigoAfip',
        Clase: CodigoAfip
    },
    marcas: {
        nombre: 'marcas',
        Clase: Marca
    },
    cteFecha: {
        nombre: 'cteFecha',
        Clase: CteFechas
    },
    cteNumerador: {
        nombre: 'cteNumerador',
        Clase: Numerador
    },
    ptoVenta: {
        nombre: 'ptoVenta',
        Clase: PtoVenta
    },
    categorias: {
        nombre: 'categorias',
        Clase: Categoria
    },
    sisCategoria: {
        nombre: 'sisCategoria',
        Clase: SisCategoria
    },
    cliente: {
        nombre: 'cliente',
        Clase: Cliente
    },
    cultivo: {
        nombre: 'cultivo',
        Clase: Cultivo
    },
    descargarListado: {
        nombre: 'descargarListado',
        Clase: null
    },
    descargarExcel: {
        nombre: 'descargarExcel',
        Clase: null
    },
    descargarStock: {
        nombre: 'descargarStock',
        Clase: null
    },
    buscaListaPrecio: {
        nombre: 'buscaListaPrecio',
        Clase: ListaPrecio
    },
    sisLetra: {
        nombre: 'sisLetra',
        Clase: SisLetra
    },
    vendedor: {
        nombre: 'vendedor',
        Clase: Vendedor
    },
    letraCodigo: {
        nombre: 'letraCodigo',
        Clase: LetraCodigo
    },
    facturacionElectronica: {
        nombre: 'facturacionElectronica',
        Clase: null
    },
    imputaciones: {
        nombre: 'imputaciones',
        Clase: null
    },
    contratos: {
        nombre: 'contratos',
        Clase: Contrato
    },
    libros: {
        nombre: 'libros',
        Clase: Libro
    },
    proveedores: {
        nombre: 'proveedores',
        Clase: Proveedor
    },
    relacionesCanje: {
        nombre: 'relacionesCanje',
        Clase: RelacionCanje
    },
    sisCotDolar: {
        nombre: 'sisCotDolar',
        Clase: SisCotDolar
    },
    tiposOpDepositos: {
        nombre: 'tiposop',
        Clase: TiposOpDepositos
    },
    version: {
        nombre: 'version',
        Clase: String
    },
    buscaCerealesCanje: {
        nombre: 'contratos-cereales',
        Clase: CanjesContratosCereales
    },
    buscaEstadosSisa: {
        nombre: 'estado-sisa',
        Clase: EstadoSisa
    },
    buscaCereales: {
        nombre: 'busca-cereales',
        Clase: Cereales
    },
    buscaParametrosCanje: {
        nombre: 'parametros-canje',
        Clase: ParametrosCanje
    },
    buscaParametrosPesificado: {
        nombre: 'parametros-pesificado',
        Clase: null
    },
    actualizaProductos: {
        nombre: 'actualiza-productos',
        Clase: null
    },
    buscaPosicionStock: {
        nombre: 'posicion-stock',
        Clase: null
    },
    actualizarVentasStock: {
        nombre: 'actualizarVentasStock',
        Clase: null
    },
};
