import { Routes, RouterModule } from '@angular/router';

import { Tablas } from './tablas.component';
import { Usuarios } from './usuarios';
import { NuevoUsuario } from './usuarios/components/nuevoUsuario';
import { EditarUsuario } from 'app/pages/main/tablas/usuarios/components/editarUsuario';
import { TipoComprobantes } from './tipoComprobantes';
import { EditarTipoComprobante } from './tipoComprobantes/components/editarTipoComprobante';
import { NuevoTipoComprobante } from './tipoComprobantes/components/nuevoTipoComprobante';
import { Rubros } from './rubros';
import { NuevoRubro } from './rubros/components/nuevoRubro';
import { EditarRubro } from './rubros/components/editarRubro';
import { SubRubros } from './subRubros';
import { NuevoSubRubro } from './subRubros/components/nuevoSubRubro';
import { EditarSubRubro } from './subRubros/components/editarSubRubro';
import { FormasPago } from './formasPago';
import { NuevaFormaPago } from 'app/pages/main/tablas/formasPago/components/nuevaFormaPago';

import { EditarFormaPago } from './formasPago/components/editarFormaPago';

import { Depositos } from './depositos';
import { EditarDeposito } from './depositos/components/editarDeposito';
import { NuevoDeposito } from './depositos/components/nuevoDeposito/nuevoDeposito.component';
import { ListaPrecios } from './listaPrecios';
import { NuevoListaPrecio } from './listaPrecios/components/nuevoListaPrecio';
import { EditarListaPrecio } from './listaPrecios/components/editarListaPrecio';
import { Productos } from 'app/pages/main/stock/productos';
import { NuevoProducto } from '../stock/productos/components/nuevoProducto';
import { EditarProducto } from 'app/pages/main/stock/productos/components/editarProducto';
import { ModeloImputacion } from './modeloImputacion';
import { NuevoModeloImputacion } from './modeloImputacion/components/nuevoModeloImputacion';
import { EditarModeloImputacion } from 'app/pages/main/tablas/modeloImputacion/components/editarModeloImputacion';
import { PendingChangesGuard } from 'app/guards/PendingChangesGuard';
import { CteFecha } from './cteFecha';
import { NuevoCteFecha } from './cteFecha/components/nuevoCteFecha';
import { EditarCteFecha } from './cteFecha/components/editarCteFecha';
import { Numerador } from '../../../models/numerador';
import { Numeradores } from './numeradores';
import { NuevoNumeradores } from './numeradores/components/nuevoNumeradores';
import { EditarNumeradores } from './numeradores/components/editarNumeradores';
import { Categorias } from './categorias';
import { NuevoCategorias } from './categorias/components/nuevoCategorias';
import { EditarCategorias } from './categorias/components/editarCategorias';
import { Clientes } from './clientes';
import { NuevoClientes } from './clientes/components/nuevoClientes';
import { EditarClientes } from 'app/pages/main/tablas/clientes/components/editarClientes';
import { Cultivos } from './cultivos';
import { NuevoCultivos } from 'app/pages/main/tablas/cultivos/components/nuevoCultivos';
import { EditarCultivos } from './cultivos/components/editarCultivos';
import { Marcas } from './marcas';
import { NuevoMarca } from './marcas/components/nuevoMarca';
import { EditarMarca } from './marcas/components/editarMarca';
import { Proveedores } from './proveedores';
import { NuevoProveedor } from './proveedores/components/nuevoProveedor';
import { EditarProveedor } from './proveedores/components/editarProveedor';
import { RelacionesCanje } from './relacionesCanje';
import { NuevoRelacionCanje } from './relacionesCanje/nuevoRelacionCanje';
import { EditarRelacionCanje } from './relacionesCanje/editarRelacionCanje';
import { SisCotsDolar } from './sisCotDolar';
import { NuevoSisCotDolar } from './sisCotDolar/components/nuevoSisCotDolar';
import { EditarSisCotDolar } from './sisCotDolar/components/editarSisCotDolar';
import { CerealesCanje } from './cereales-canje';
import { ParametrosCanje } from './parametros-canje';
import { Autorizacion } from './autorizacion';
import { ActualizacionProductos } from './actualizacion-productos';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Tablas,
        children: [
            { path: 'usuarios', component: Usuarios },
            { path: 'usuarios/nuevo', component: NuevoUsuario, canDeactivate: [PendingChangesGuard] },
            { path: 'usuarios/editar/:idUsuario', component: EditarUsuario, canDeactivate: [PendingChangesGuard] },
            { path: 'tipos-comprobantes', component: TipoComprobantes },
            { path: 'tipos-comprobantes/nuevo', component: NuevoTipoComprobante, canDeactivate: [PendingChangesGuard] },
            { path: 'tipos-comprobantes/editar/:idTipoComprobante', component: EditarTipoComprobante, canDeactivate: [PendingChangesGuard] },
            { path: 'rubros', component: Rubros },
            { path: 'rubros/nuevo', component: NuevoRubro, canDeactivate: [PendingChangesGuard] },
            { path: 'rubros/editar/:idRubro', component: EditarRubro, canDeactivate: [PendingChangesGuard] },
            { path: 'sub-rubros', component: SubRubros },
            { path: 'sub-rubros/nuevo', component: NuevoSubRubro, canDeactivate: [PendingChangesGuard] },
            { path: 'sub-rubros/editar/:idSubRubro', component: EditarSubRubro, canDeactivate: [PendingChangesGuard] },
            { path: 'formas-pago', component: FormasPago },
            { path: 'formas-pago/nuevo', component: NuevaFormaPago, canDeactivate: [PendingChangesGuard] },
            { path: 'formas-pago/editar/:idFormaPago', component: EditarFormaPago, canDeactivate: [PendingChangesGuard] },
            { path: 'depositos', component: Depositos },
            { path: 'depositos/nuevo', component: NuevoDeposito, canDeactivate: [PendingChangesGuard] },
            { path: 'depositos/editar/:idDeposito', component: EditarDeposito, canDeactivate: [PendingChangesGuard] },
            { path: 'lista-precios', component: ListaPrecios },
            { path: 'lista-precios/nuevo', component: NuevoListaPrecio, canDeactivate: [PendingChangesGuard] },
            { path: 'lista-precios/editar/:idListaPrecio', component: EditarListaPrecio, canDeactivate: [PendingChangesGuard] },
            { path: 'modelo-imputacion', component: ModeloImputacion },
            { path: 'modelo-imputacion/nuevo', component: NuevoModeloImputacion, canDeactivate: [PendingChangesGuard] },
            { path: 'modelo-imputacion/editar/:idModeloCab', component: EditarModeloImputacion, canDeactivate: [PendingChangesGuard] },
            { path: 'cte-fecha', component: CteFecha },
            { path: 'cte-fecha/nuevo', component: NuevoCteFecha, canDeactivate: [PendingChangesGuard] },
            { path: 'cte-fecha/editar/:idCteFechas', component: EditarCteFecha, canDeactivate: [PendingChangesGuard] },
            { path: 'numeradores', component: Numeradores },
            { path: 'numeradores/nuevo', component: NuevoNumeradores, canDeactivate: [PendingChangesGuard] },
            { path: 'numeradores/editar/:idCteNumerador', component: EditarNumeradores, canDeactivate: [PendingChangesGuard] },
            { path: 'categorias', component: Categorias },
            { path: 'categorias/nuevo', component: NuevoCategorias, canDeactivate: [PendingChangesGuard] },
            { path: 'categorias/editar/:idCategoria', component: EditarCategorias, canDeactivate: [PendingChangesGuard] },
            { path: 'clientes', component: Clientes },
            { path: 'clientes/nuevo', component: NuevoClientes, canDeactivate: [PendingChangesGuard] },
            { path: 'clientes/editar/:idCliente', component: EditarClientes, canDeactivate: [PendingChangesGuard] },
            { path: 'cultivos', component: Cultivos },
            { path: 'cultivos/nuevo', component: NuevoCultivos, canDeactivate: [PendingChangesGuard] },
            { path: 'cultivos/editar/:idCultivo', component: EditarCultivos, canDeactivate: [PendingChangesGuard] },
            { path: 'marcas', component: Marcas },
            { path: 'marcas/nuevo', component: NuevoMarca, canDeactivate: [PendingChangesGuard] },
            { path: 'marcas/editar/:idMarcas', component: EditarMarca, canDeactivate: [PendingChangesGuard] },
            { path: 'proveedores', component: Proveedores },
            { path: 'proveedores/nuevo', component: NuevoProveedor, canDeactivate: [PendingChangesGuard] },
            { path: 'proveedores/editar/:idPadronProveedor', component: EditarProveedor, canDeactivate: [PendingChangesGuard] },
            { path: 'relaciones-canje', component: RelacionesCanje },
            { path: 'relaciones-canje/nuevo', component: NuevoRelacionCanje, canDeactivate: [PendingChangesGuard] },
            { path: 'relaciones-canje/editar/:idRelacionSisCanje', component: EditarRelacionCanje, canDeactivate: [PendingChangesGuard] },
            { path: 'cot-dolar', component: SisCotsDolar },
            { path: 'cot-dolar/nuevo', component: NuevoSisCotDolar, canDeactivate: [PendingChangesGuard] },
            { path: 'cot-dolar/editar/:idSisCotDolar', component: EditarSisCotDolar, canDeactivate: [PendingChangesGuard] },
            { path: 'canje-cereal', component: CerealesCanje },
            { path: 'parametros-canje', component: ParametrosCanje },
            { path: 'autorizacion', component: Autorizacion },
            { path: 'actualizacion-productos', component: ActualizacionProductos }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
