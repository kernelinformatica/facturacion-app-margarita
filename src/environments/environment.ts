export const environment = {
    production: false,
    versionSistema: "8.9",
    facturacionRest: {
     //urlBase: 'http://10.0.0.212:8080/facturacionrest-margarita-v18/ws',
      // urlBase: 'http://192.168.140.119:8080/facturacionrest-margarita-v14/ws',
     urlBase: 'http://localhost:8080/facturacionrest/ws',
       urlFactElectronica: 'http://localhost:8080/xxxxxxx/ws',
        timeoutDefault: 60000
    },
    localStorage: {
        acceso: 'accesoActivo',
        menu: 'menuActivo',
        perfil: 'perfilActivo',
        usuario: 'usuarioActivo',
        cuenta: 'cuenta',

    },
    versionLocal: {
        numero: '8.9',
        descripcion: 'Produccion'
    }
};
