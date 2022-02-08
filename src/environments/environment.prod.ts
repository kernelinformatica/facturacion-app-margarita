let jsonURL = require('../assets/data/url.json'); 
export const environment = {
    production: true,
    facturacionRest: {
        urlBase: jsonURL.urlBase, 
        urlFactElectronica: jsonURL.urlFactElectronica,        
        timeoutDefault: 60000
    },
    localStorage: {
        acceso: 'accesoActivo',
        menu: 'menuActivo',
        perfil: 'perfilActivo',
        usuario: 'usuarioActivo'
    },
    versionLocal: { 
        numero: '1.1.1',
        descripcion: 'Produccion'
    }
};