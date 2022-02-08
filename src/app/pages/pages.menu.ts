export const PAGES_MENU = [
    {
        path: 'pages',
        children: [
            {
                path: '#',
                data: {
                    menu: {
                        title: 'general.menu.facturacion',
                        icon: 'ion-android-arrow-dropdown',
                        selected: false,
                        expanded: false,
                        order: 0
                    }
                }
            },

            {
                path: 'dashboard',
                data: {
                    menu: {
                        title: 'general.menu.Inicio',
                        icon: 'ion-android-home',
                        selected: false,
                        expanded: false,
                        order: 0
                    }
                }
            },
            {
                path: 'catalogos',
                data: {
                    menu: {
                        title: 'general.menu.catalogos',
                        icon: 'ion-edit',
                        selected: false,
                        expanded: false,
                        order: 100,
                    }
                },
                children: [
                    {
                        path: 'articulos',
                        data: {
                            menu: {
                                title: 'general.menu.articulos',
                            }
                        }
                    },
                    {
                        path: 'ptovta',
                        data: {
                            menu: {
                                title: 'general.menu.ptovta',
                            }
                        }
                    },
                    {
                        path: 'iva',
                        data: {
                            menu: {
                                title: 'general.menu.iva',
                            }
                        }
                    },
                    {
                        path: 'operadores',
                        data: {
                            menu: {
                                title: 'general.menu.operadores',
                            }
                        }
                    }

                ]
            },
            {
                path: 'stock',
                data: {
                    menu: {
                        title: 'general.menu.stock',
                        icon: 'ion-gear-a',
                        selected: false,
                        expanded: false,
                        order: 250,
                    }
                },
                children: [
                    {
                        path: 'abmprecios',
                        data: {
                            menu: {
                                title: 'general.menu.abmprecios',
                            }
                        }
                    }
                ]
            },
            {
                path: 'compras',
                data: {
                    menu: {
                        title: 'general.menu.compra',
                        icon: 'ion-stats-bars',
                        selected: false,
                        expanded: false,
                        order: 200,
                    }
                },
                children: [
                    {
                        path: 'carga',
                        data: {
                            menu: {
                                title: 'general.menu.cargacompra',
                            }
                        }
                    }
                ]
            },
            {
                path: 'venta',
                data: {
                    menu: {
                        title: 'general.menu.venta',
                        icon: 'ion-android-laptop',
                        selected: false,
                        expanded: false,
                        order: 300,
                    }
                },
                children: [
                    {
                        path: 'cargaventa',
                        data: {
                            menu: {
                                title: 'general.menu.cargaventa',
                            }
                        }

                    },
                ]
            },
            {
                path: 'utilidades',
                data: {
                    menu: {
                        title: 'general.menu.utilidades',
                        icon: 'ion-compose',
                        selected: false,
                        expanded: false,
                        order: 400,
                    }
                },
                children: [
                    {
                        path: 'listado-audita',
                        data: {
                            menu: {
                                title: 'general.menu.listado-audita',
                            }
                        }
                    }

                ]
            },
            {
                path: 'parametros',
                data: {
                    menu: {
                        title: 'general.menu.parametros',
                        icon: 'ion-grid',
                        selected: false,
                        expanded: false,
                        order: 500,
                    }
                },
                children: [
                    {
                        path: 'empresa',
                        data: {
                            menu: {
                                title: 'general.menu.empresa',
                            }
                        }
                    }



                ]
            },

        ]
    }
];
