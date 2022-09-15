export const environment = {
    production: false,
    facturacionRest: {
        //urlBase: 'http://localhost:8080/facturacionrest/ws', 
        urlBase: 'http://192.168.140.119:8080/facturacionrest-margarita-v8/ws', 
        urlFactElectronica: 'http://localhost:8080/facturacionElectronica/ws',        
        timeoutDefault: 60000
    },
    localStorage: { 
        acceso: 'accesoActivo',
        menu: 'menuActivo',
        perfil: 'perfilActivo',
        usuario: 'usuarioActivo',
        cuenta: 'cuenta'
    },
    versionLocal: { 
        numero: '1.1.1', 
        descripcion: 'Produccion'
    }
};