import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    constructor( ) { }

    /**
     * Setear algo en el localStorage, puede ser un json
     */
    setObject = (key) => (value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }


    /**
     * Obtener algo del localStorage
     */
    getObject = (key) => {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    }

    /**
     * Limpia el local storage
     */
    clearLocalStorage = () => {
        localStorage.clear();
    }

    getMenus = () => this.getObject('menuActivo');

    /**
     * Retorna todos los menus abm
     */
    getAbmMenus = () => {
        const menus = this.getObject('menuActivo');

        if (menus && menus[0] && menus[0].children) {
            const tablas = menus[0].children.find(m => m.path === 'tablas');

            return tablas ? tablas.children : null
        }
    }
}
