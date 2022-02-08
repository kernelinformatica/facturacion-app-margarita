import { NgModule, Injectable }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { CustomCard } from 'app/pages/reusable/cards/customCard';

import { DataFilterPipe } from 'app/pages/reusable/tablas/dataTables/data-filter.pipe';
import { DataTables } from 'app/pages/reusable/tablas/dataTables';
import { DataTableModule } from 'angular2-datatable';
import { NgaModule } from 'app/theme/nga.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupLista } from 'app/pages/reusable/otros/popup-lista/popup-lista.component';
import { ListFinder } from '../reusable/otros/listFinder/listFinder';
import { ListPopup } from 'app/pages/reusable/otros/listFinder/components/listPopup/listPopup';
import { DateLickePicker } from 'app/pages/reusable/otros/dateLickePicker/dateLickePicker.component';
import { SexiList } from '../reusable/listas/sexiList';
import { SearchClient } from '../reusable/otros/searchClient/searchClient.component';
import { SearchProducto } from '../reusable/otros/searchProducto/searchProducto.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataTableModule,
        NgaModule,
        NgbDatepickerModule,
    ],
    declarations: [
        CustomCard,
        DataTables,
        DataFilterPipe,
        PopupLista,
        ListFinder,
        ListPopup,
        DateLickePicker,
        SexiList,
        SearchClient,
        SearchProducto
    ],
    providers: [
    ],
    exports: [
        CustomCard,
        DataTables,
        DataFilterPipe,
        CommonModule,
        FormsModule,
        DataTableModule,
        NgaModule,
        NgbDatepickerModule,
        PopupLista,
        ListFinder,
        ListPopup,
        DateLickePicker,
        SexiList,
        SearchClient,
        SearchProducto
    ]
})
export class SharedModule {}
