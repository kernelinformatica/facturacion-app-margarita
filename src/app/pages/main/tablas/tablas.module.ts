import { NgModule } from '@angular/core';
import { routing } from './tablas.routing';
import { Tablas } from 'app/pages/main/tablas';
import { DataTablesService } from '../../reusable/tablas/dataTables/dataTables.service';
import { Usuarios } from './usuarios';
import { NuevoUsuario } from './usuarios/components/nuevoUsuario';
import { AuthService } from '../../../services/authService';
import { LocalStorageService } from '../../../services/localStorageService';
import { EditarUsuario } from './usuarios/components/editarUsuario';
import { UtilsService } from '../../../services/utilsService';
import { TipoComprobantes } from './tipoComprobantes';
import { EditarTipoComprobante } from './tipoComprobantes/components/editarTipoComprobante';
import { NuevoTipoComprobante } from './tipoComprobantes/components/nuevoTipoComprobante';
import { Rubros } from './rubros';
import { NuevoRubro } from './rubros/components/nuevoRubro';
import { EditarRubro } from './rubros/components/editarRubro';
import { NuevoRecurso } from '../../reusable/formularios/nuevoRecurso';
import { SubRubros } from './subRubros';
import { NuevoSubRubro } from './subRubros/components/nuevoSubRubro';
import { EditarSubRubro } from './subRubros/components/editarSubRubro';
import { FormasPago } from 'app/pages/main/tablas/formasPago';
import { NuevaFormaPago } from './formasPago/components/nuevaFormaPago';

import { RecursoService } from '../../../services/recursoService';
import { EditarFormaPago } from './formasPago/components/editarFormaPago';

import { Depositos } from './depositos';
import { EditarDeposito } from './depositos/components/editarDeposito';
import { NuevoDeposito } from './depositos/components/nuevoDeposito/nuevoDeposito.component';
import { ListaPrecios } from './listaPrecios';
import { NuevoListaPrecio } from './listaPrecios/components/nuevoListaPrecio';
import { EditarListaPrecio } from './listaPrecios/components/editarListaPrecio';
import { SharedModule } from '../SharedModule';
import { ModeloImputacion } from './modeloImputacion';
import { NuevoModeloImputacion } from './modeloImputacion/components/nuevoModeloImputacion';
import { EditarModeloImputacion } from './modeloImputacion/components/editarModeloImputacion';
import { PendingChangesGuard } from 'app/guards/PendingChangesGuard';
import { CteFecha } from './cteFecha';
import { EditarCteFecha } from './cteFecha/components/editarCteFecha';
import { NuevoCteFecha } from './cteFecha/components/nuevoCteFecha';
import { Numeradores } from './numeradores';
import { NuevoNumeradores } from './numeradores/components/nuevoNumeradores';
import { EditarNumeradores } from './numeradores/components/editarNumeradores';
import { NuevoCategorias } from './categorias/components/nuevoCategorias';
import { EditarCategorias } from 'app/pages/main/tablas/categorias/components/editarCategorias';
import { Categorias } from 'app/pages/main/tablas/categorias';
import { Clientes } from 'app/pages/main/tablas/clientes';
import { NuevoClientes } from './clientes/components/nuevoClientes';
import { EditarClientes } from './clientes/components/editarClientes';
import { Cultivos } from './cultivos';
import { NuevoCultivos } from './cultivos/components/nuevoCultivos';
import { EditarCultivos } from './cultivos/components/editarCultivos';
import { Marcas } from './marcas';
import { NuevoMarca } from './marcas/components/nuevoMarca';
import { EditarMarca } from './marcas/components/editarMarca';
import { FilesService } from 'app/services/filesService';
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
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        routing,
        SharedModule,
        NgbTabsetModule
    ],
    declarations: [
        Tablas,
        Usuarios,
        NuevoUsuario,
        EditarUsuario,
        TipoComprobantes,
        NuevoTipoComprobante,
        EditarTipoComprobante,
        Rubros,
        NuevoRubro,
        EditarRubro,
        NuevoRecurso,
        SubRubros,
        NuevoSubRubro,
        EditarSubRubro,
        FormasPago,
        NuevaFormaPago,
        EditarFormaPago,
        Depositos,
        NuevoDeposito,
        EditarDeposito,
        ListaPrecios,
        NuevoListaPrecio,
        EditarListaPrecio,
        ModeloImputacion,
        NuevoModeloImputacion,
        EditarModeloImputacion,
        CteFecha,
        EditarCteFecha,
        NuevoCteFecha,
        Numeradores,
        NuevoNumeradores,
        EditarNumeradores,
        Categorias,
        EditarCategorias,
        NuevoCategorias,
        Clientes,
        NuevoClientes,
        EditarClientes,
        Cultivos,
        NuevoCultivos,
        EditarCultivos,
        Marcas,
        NuevoMarca,
        EditarMarca,
        Proveedores,
        NuevoProveedor,
        EditarProveedor,
        RelacionesCanje,
        NuevoRelacionCanje,
        EditarRelacionCanje,
        SisCotsDolar,
        NuevoSisCotDolar,
        EditarSisCotDolar,
        CerealesCanje,
        ParametrosCanje,
        Autorizacion,
        ActualizacionProductos
    ],
    providers: [
        DataTablesService,
        AuthService,
        LocalStorageService,
        UtilsService,
        RecursoService,
        PendingChangesGuard,
        FilesService
    ]
})
export class TablasModule {
}
