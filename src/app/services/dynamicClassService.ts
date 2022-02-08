import { Usuario } from "app/models/usuario";
import { TipoComprobante } from "app/models/tipoComprobante";
import { Rubro } from "app/models/rubro";
import { Empresa } from "app/models/empresa";
import { FormaPago } from "app/models/formaPago";
import { IVA } from "app/models/IVA";
import { MenuSucursal } from "app/models/menuSucursal";
import { Perfil } from "app/models/perfil";
import { Producto } from "app/models/producto";
import { SubRubro } from "app/models/subRubro";
import { Sucursal } from "app/models/sucursal";
import { TipoFormaPago } from "app/models/tipoFormaPago";
import { Unidad } from "app/models/unidad";
import { Deposito } from "app/models/deposito";
import { ListaPrecio } from "app/models/listaPrecio";
import { Moneda } from "app/models/moneda";
import { ModeloCab } from "app/models/modeloCab";
import { CteFechas } from "app/models/cteFechas";
import { Numerador } from "app/models/numerador";
import { Categoria } from "app/models/categoria";
import { Cliente } from "app/models/cliente";
import { Cultivo } from "app/models/cultivo";
import { Vendedor } from "app/models/vendedor";
import { Marca } from "app/models/marca";
import { Proveedor } from "app/models/proveedor";
import { RelacionCanje } from "app/models/relacionCanje";
import { SisCotDolar } from "app/models/sisCotDolar";

const classes = {
    Usuario,
    TipoComprobante,
    Rubro,
    Empresa,
    FormaPago,
    IVA,
    MenuSucursal,
    Perfil,
    Producto,
    SubRubro,
    Sucursal,
    TipoFormaPago,
    Unidad,
    Deposito,
    ListaPrecio,
    Moneda,
    ModeloCab,
    CteFechas,
    Numerador,
    Categoria,
    Cliente,
    Cultivo,
    Vendedor,
    Marca,
    Proveedor,
    RelacionCanje,
    SisCotDolar
};

// export default function dynamicClass (name) {
//     return classes[name];
// }
export function dynamicClass (name) {
    return classes[name];
}
