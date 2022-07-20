export const environment = {
    production: true,
    facturacionRest: {
        /*  urlBase:"ttp://10.0.0.212:8080/facturacionrest-margarita/ws", 
          urlFactElectronica: "http://localhost:8080/facturacionElectronica/ws",*/ 
        urlBase:"http://192.168.140.119:8080/facturacionrest-margarita-V3/ws", 
        urlFactElectronica: "http://localhost:8080/facturacionElectronica/ws",        
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