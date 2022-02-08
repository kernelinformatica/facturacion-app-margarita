import { Injectable } from '@angular/core';

@Injectable()
export class DataTablesService {

    dataTableData = [{
        'name': 'Wing',
        'email': 'tellus.eu.augue@arcu.com',
        'regDate': '2016-01-09T14:48:34-08:00',
        'city': 'Paglieta',
        'age': 25
    },
    {
        'name': 'Whitney',
        'email': 'sed.dictum@Donec.org',
        'regDate': '2017-01-23T20:09:52-08:00',
        'city': 'Bear',
        'age': 32
    },
    {
        'name': 'Oliver',
        'email': 'mauris@Craslorem.ca',
        'regDate': '2015-11-19T19:11:33-08:00',
        'city': 'Bruderheim',
        'age': 31
    },
    {
        'name': 'Vladimir',
        'email': 'mi.Aliquam@Phasellus.net',
        'regDate': '2015-11-02T07:59:34-08:00',
        'city': 'Andenne',
        'age': 50
    },
    {
        'name': 'Maggy',
        'email': 'ligula@acorciUt.edu',
        'regDate': '2017-02-25T15:42:17-08:00',
        'city': 'HomprŽ',
        'age': 24
    },
    {
        'name': 'Unity',
        'email': 'Nunc.commodo@justo.org',
        'regDate': '2016-03-07T03:47:55-08:00',
        'city': 'Ried im Innkreis',
        'age': 23
    },
    {
        'name': 'Ralph',
        'email': 'augue@penatibuset.net',
        'regDate': '2017-02-27T20:03:50-08:00',
        'city': 'Cwmbran',
        'age': 45
    },
    {
        'name': 'Medge',
        'email': 'sagittis.augue@taciti.edu',
        'regDate': '2016-03-02T03:59:17-08:00',
        'city': 'Maranguape',
        'age': 21
    },
    {
        'name': 'Orli',
        'email': 'nascetur@mipedenonummy.edu',
        'regDate': '2016-11-07T20:48:43-08:00',
        'city': 'Gibbons',
        'age': 38
    },
    {
        'name': 'Ainsley',
        'email': 'morbi.tristique.senectus@enim.ca',
        'regDate': '2016-02-11T22:14:36-08:00',
        'city': 'Guardia Perticara',
        'age': 43
    },
    {
        'name': 'Candice',
        'email': 'turpis.non.enim@fringillami.com',
        'regDate': '2015-04-23T12:29:39-07:00',
        'city': 'Aylmer',
        'age': 25
    },
    {
        'name': 'Alexis',
        'email': 'lacinia.orci.consectetuer@dolorFuscefeugiat.ca',
        'regDate': '2016-08-18T12:06:56-07:00',
        'city': 'Halkirk',
        'age': 35
    },
    {
        'name': 'Diana',
        'email': 'pede.Cras@a.edu',
        'regDate': '2016-12-24T00:53:04-08:00',
        'city': 'Palermo',
        'age': 31
    },
    {
        'name': 'Tyrone',
        'email': 'ornare.In@duilectus.co.uk',
        'regDate': '2015-03-31T11:45:57-07:00',
        'city': 'Bellevue',
        'age': 36
    },
    {
        'name': 'Brennan',
        'email': 'scelerisque.lorem@enim.net',
        'regDate': '2016-09-07T16:12:31-07:00',
        'city': 'Oxford County',
        'age': 38
    },
    {
        'name': 'Lillith',
        'email': 'non@lectus.edu',
        'regDate': '2016-08-01T12:45:06-07:00',
        'city': 'Lillois-WitterzŽe',
        'age': 25
    },
    {
        'name': 'Wayne',
        'email': 'at.egestas.a@Pellentesque.edu',
        'regDate': '2016-02-23T10:20:18-08:00',
        'city': 'Baie-Saint-Paul',
        'age': 32
    },
    {
        'name': 'Vielka',
        'email': 'Nam.porttitor@Uttincidunt.ca',
        'regDate': '2016-07-18T19:26:59-07:00',
        'city': 'Rodgau',
        'age': 21
    },
    {
        'name': 'Armando',
        'email': 'Aliquam@orciin.net',
        'regDate': '2016-12-07T17:31:26-08:00',
        'city': 'Khanewal',
        'age': 30
    },
    {
        'name': 'Justin',
        'email': 'gravida.non.sollicitudin@placerataugue.edu',
        'regDate': '2016-09-23T20:17:41-07:00',
        'city': 'İslahiye',
        'age': 20
    },
    {
        'name': 'Zorita',
        'email': 'enim@risus.org',
        'regDate': '2015-06-14T12:12:00-07:00',
        'city': 'Burdinne',
        'age': 20
    },
    {
        'name': 'Mariam',
        'email': 'purus.mauris.a@odiosagittis.ca',
        'regDate': '2016-10-14T18:52:48-07:00',
        'city': 'Bharatpur',
        'age': 22
    },
    {
        'name': 'Malik',
        'email': 'Nam@enimEtiam.org',
        'regDate': '2016-09-20T18:06:55-07:00',
        'city': 'Neerheylissem',
        'age': 28
    },
    {
        'name': 'Claire',
        'email': 'sapien@Nullamlobortis.ca',
        'regDate': '2016-12-29T09:49:13-08:00',
        'city': 'San Fratello',
        'age': 24
    },
    {
        'name': 'Hilel',
        'email': 'tempor@purusmaurisa.edu',
        'regDate': '2016-07-09T12:03:31-07:00',
        'city': 'La Cruz',
        'age': 30
    },
    {
        'name': 'Alea',
        'email': 'vulputate@orciUt.ca',
        'regDate': '2015-03-21T02:28:40-07:00',
        'city': 'Leominster',
        'age': 43
    },
    {
        'name': 'Nash',
        'email': 'Nunc.ullamcorper.velit@egetmetuseu.edu',
        'regDate': '2016-10-21T10:38:41-07:00',
        'city': 'Gravataí',
        'age': 20
    },
    {
        'name': 'Brennan',
        'email': 'Vestibulum@Sedpharetra.org',
        'regDate': '2016-06-06T22:37:33-07:00',
        'city': 'Carleton',
        'age': 31
    },
    {
        'name': 'Diana',
        'email': 'Cras.vulputate@erosturpisnon.edu',
        'regDate': '2016-09-07T18:40:26-07:00',
        'city': 'Ripabottoni',
        'age': 36
    },
    {
        'name': 'Farrah',
        'email': 'dignissim.tempor.arcu@gravidamaurisut.edu',
        'regDate': '2016-11-30T23:52:41-08:00',
        'city': 'Aguacaliente (San Francisco)',
        'age': 37
    },
    {
        'name': 'August',
        'email': 'tincidunt.Donec@dictumeleifendnunc.org',
        'regDate': '2016-11-21T05:57:31-08:00',
        'city': 'Hameln',
        'age': 21
    },
    {
        'name': 'Reese',
        'email': 'et.magnis.dis@montesnasceturridiculus.net',
        'regDate': '2015-07-01T14:09:53-07:00',
        'city': 'St. Catharines',
        'age': 22
    },
    {
        'name': 'Pascale',
        'email': 'pede.ultrices@lacinia.com',
        'regDate': '2016-02-18T05:11:43-08:00',
        'city': 'Newmarket',
        'age': 50
    },
    {
        'name': 'Gage',
        'email': 'In.mi.pede@diameu.edu',
        'regDate': '2016-07-31T17:51:58-07:00',
        'city': 'Ilhéus',
        'age': 20
    },
    {
        'name': 'Nora',
        'email': 'Ut.semper.pretium@luctussit.net',
        'regDate': '2016-01-23T17:01:09-08:00',
        'city': 'Kirkintilloch',
        'age': 32
    },
    {
        'name': 'Jameson',
        'email': 'dolor.Fusce.feugiat@tempusnon.ca',
        'regDate': '2016-06-24T08:52:43-07:00',
        'city': 'Uikhoven',
        'age': 46
    },
    {
        'name': 'Ryder',
        'email': 'Vestibulum.accumsan@egetmetus.co.uk',
        'regDate': '2015-08-02T00:01:28-07:00',
        'city': 'São Gonçalo',
        'age': 28
    },
    {
        'name': 'Lyle',
        'email': 'libero.nec.ligula@euaugueporttitor.co.uk',
        'regDate': '2015-11-15T05:40:15-08:00',
        'city': 'Vieux-Genappe',
        'age': 29
    },
    {
        'name': 'Carly',
        'email': 'vitae.sodales@pretium.co.uk',
        'regDate': '2016-01-11T16:09:51-08:00',
        'city': 'Spresiano',
        'age': 48
    },
    {
        'name': 'Hector',
        'email': 'luctus@orci.com',
        'regDate': '2016-12-20T18:58:28-08:00',
        'city': 'Jerzu',
        'age': 35
    },
    {
        'name': 'Luke',
        'email': 'luctus.aliquet.odio@bibendumDonecfelis.edu',
        'regDate': '2016-03-06T03:19:08-08:00',
        'city': 'Bothey',
        'age': 45
    },
    {
        'name': 'Celeste',
        'email': 'et.malesuada.fames@utdolordapibus.org',
        'regDate': '2015-10-04T23:37:46-07:00',
        'city': 'Armstrong',
        'age': 42
    },
    {
        'name': 'Ila',
        'email': 'urna.Nullam@nullaCraseu.ca',
        'regDate': '2015-05-10T09:00:25-07:00',
        'city': 'Flint',
        'age': 34
    },
    {
        'name': 'Leila',
        'email': 'vehicula@orciUtsagittis.net',
        'regDate': '2016-11-13T02:20:11-08:00',
        'city': 'Ulloa (Barrial)',
        'age': 35
    },
    {
        'name': 'Zahir',
        'email': 'eleifend.non.dapibus@auguescelerisque.edu',
        'regDate': '2015-07-13T14:10:16-07:00',
        'city': 'Ñuñoa',
        'age': 21
    },
    {
        'name': 'Jin',
        'email': 'fames.ac.turpis@Namligula.edu',
        'regDate': '2015-06-17T23:31:55-07:00',
        'city': 'San Felipe',
        'age': 25
    },
    {
        'name': 'Wallace',
        'email': 'natoque.penatibus@tortorIntegeraliquam.com',
        'regDate': '2016-11-02T22:00:54-07:00',
        'city': 'Rock Springs',
        'age': 39
    },
    {
        'name': 'Wallace',
        'email': 'nulla.magna.malesuada@cursusNuncmauris.edu',
        'regDate': '2016-01-25T09:13:43-08:00',
        'city': 'Copiapó',
        'age': 31
    },
    {
        'name': 'Buffy',
        'email': 'est@Vestibulumanteipsum.edu',
        'regDate': '2016-10-10T13:54:26-07:00',
        'city': 'Sens',
        'age': 48
    },
    {
        'name': 'Jin',
        'email': 'orci.in@nuncsitamet.org',
        'regDate': '2017-01-23T07:56:18-08:00',
        'city': 'Drumheller',
        'age': 44
    },
    {
        'name': 'Ethan',
        'email': 'ad@enimcommodohendrerit.com',
        'regDate': '2015-07-09T20:16:24-07:00',
        'city': 'Ghaziabad',
        'age': 32
    },
    {
        'name': 'Sheila',
        'email': 'dictum@rhoncus.com',
        'regDate': '2015-10-15T05:15:47-07:00',
        'city': 'Hay River',
        'age': 25
    },
    {
        'name': 'Jolie',
        'email': 'facilisis@uterat.net',
        'regDate': '2016-04-30T20:48:31-07:00',
        'city': 'Anderlues',
        'age': 32
    },
    {
        'name': 'Eugenia',
        'email': 'dolor@nibhsit.ca',
        'regDate': '2017-01-23T06:17:22-08:00',
        'city': 'Wardha',
        'age': 36
    },
    {
        'name': 'Suki',
        'email': 'pretium.neque@consequatnecmollis.net',
        'regDate': '2016-04-20T07:03:02-07:00',
        'city': 'Meldert',
        'age': 42
    },
    {
        'name': 'Barrett',
        'email': 'a@lobortismaurisSuspendisse.edu',
        'regDate': '2015-08-27T11:25:51-07:00',
        'city': 'Keith',
        'age': 40
    },
    {
        'name': 'Tashya',
        'email': 'nascetur@tinciduntadipiscingMauris.ca',
        'regDate': '2015-05-31T10:57:18-07:00',
        'city': 'Sint-Amandsberg',
        'age': 30
    },
    {
        'name': 'Doris',
        'email': 'vitae@Ut.net',
        'regDate': '2015-03-17T08:21:56-07:00',
        'city': 'Freirina',
        'age': 27
    },
    {
        'name': 'Herrod',
        'email': 'arcu.Vestibulum@augueporttitorinterdum.co.uk',
        'regDate': '2016-08-31T10:30:49-07:00',
        'city': 'Hollabrunn',
        'age': 47
    },
    {
        'name': 'Patience',
        'email': 'gravida@in.ca',
        'regDate': '2017-02-26T03:44:58-08:00',
        'city': 'Borsbeek',
        'age': 21
    },
    {
        'name': 'arden',
        'email': 'tincidunt.nunc.ac@nibhenim.ca',
        'regDate': '2017-01-29T12:42:50-08:00',
        'city': 'Wolkrange',
        'age': 36
    },
    {
        'name': 'Harper',
        'email': 'tempor.lorem@quisturpis.edu',
        'regDate': '2016-04-07T12:53:49-07:00',
        'city': 'Marano Lagunare',
        'age': 49
    },
    {
        'name': 'Burke',
        'email': 'lobortis@velpede.ca',
        'regDate': '2015-06-01T22:29:44-07:00',
        'city': 'Nadiad',
        'age': 49
    },
    {
        'name': 'Jael',
        'email': 'hendrerit.a.arcu@montes.edu',
        'regDate': '2016-05-08T03:28:35-07:00',
        'city': 'Cuenca',
        'age': 32
    },
    {
        'name': 'Stephanie',
        'email': 'dictum@Inmi.net',
        'regDate': '2016-03-29T01:03:51-07:00',
        'city': 'Driekapellen',
        'age': 39
    },
    {
        'name': 'Frances',
        'email': 'lectus.quis.massa@non.ca',
        'regDate': '2015-05-21T14:05:00-07:00',
        'city': 'Bama',
        'age': 38
    },
    {
        'name': 'Mark',
        'email': 'est.Mauris@arcuvel.ca',
        'regDate': '2015-08-01T19:53:38-07:00',
        'city': 'St. Andrews',
        'age': 44
    },
    {
        'name': 'Roth',
        'email': 'enim.non.nisi@Lorem.net',
        'regDate': '2016-10-12T15:20:15-07:00',
        'city': 'Teltow',
        'age': 26
    },
    {
        'name': 'Dakota',
        'email': 'sed.orci@ligulaAeneaneuismod.org',
        'regDate': '2016-05-21T06:15:26-07:00',
        'city': 'Dover',
        'age': 25
    },
    {
        'name': 'Teegan',
        'email': 'augue.eu.tempor@Integervulputate.org',
        'regDate': '2017-02-18T17:49:14-08:00',
        'city': 'Hattem',
        'age': 40
    },
    {
        'name': 'Chandler',
        'email': 'a.odio@sedturpis.edu',
        'regDate': '2015-05-23T17:57:39-07:00',
        'city': 'Wellington',
        'age': 34
    },
    {
        'name': 'Kathleen',
        'email': 'Ut.tincidunt.vehicula@consectetuerrhoncusNullam.edu',
        'regDate': '2016-03-09T13:50:40-08:00',
        'city': 'Weelde',
        'age': 30
    },
    {
        'name': 'Scarlet',
        'email': 'Suspendisse.non@montesnascetur.com',
        'regDate': '2015-06-21T11:13:19-07:00',
        'city': 'Tuktoyaktuk',
        'age': 32
    },
    {
        'name': 'Haley',
        'email': 'risus@Cras.net',
        'regDate': '2017-01-22T07:25:39-08:00',
        'city': 'Hudiksvall',
        'age': 23
    },
    {
        'name': 'Jesse',
        'email': 'odio@amet.org',
        'regDate': '2016-01-29T13:03:43-08:00',
        'city': 'Veere',
        'age': 43
    },
    {
        'name': 'Noble',
        'email': 'vulputate.risus.a@Quisqueliberolacus.co.uk',
        'regDate': '2016-08-16T08:07:57-07:00',
        'city': 'Cornwall',
        'age': 47
    },
    {
        'name': 'Phelan',
        'email': 'nascetur.ridiculus@fringilla.edu',
        'regDate': '2015-11-09T06:20:07-08:00',
        'city': 'Oosterhout',
        'age': 50
    },
    {
        'name': 'Amos',
        'email': 'Phasellus.fermentum@montesnascetur.ca',
        'regDate': '2016-01-20T22:02:46-08:00',
        'city': 'Llaillay',
        'age': 31
    },
    {
        'name': 'Pandora',
        'email': 'aliquet.Phasellus@sociis.ca',
        'regDate': '2016-02-21T02:47:32-08:00',
        'city': 'São José dos Pinhais',
        'age': 38
    },
    {
        'name': 'Jada',
        'email': 'eu@a.edu',
        'regDate': '2016-01-10T23:12:06-08:00',
        'city': 'Venezia',
        'age': 33
    },
    {
        'name': 'Abraham',
        'email': 'Nunc@Vivamus.com',
        'regDate': '2017-02-15T20:23:36-08:00',
        'city': 'Wambeek',
        'age': 41
    },
    {
        'name': 'Bert',
        'email': 'non.bibendum@mollisduiin.org',
        'regDate': '2015-07-17T06:27:40-07:00',
        'city': 'Vezzi Portio',
        'age': 35
    },
    {
        'name': 'Lars',
        'email': 'dolor.Fusce.feugiat@metusurnaconvallis.ca',
        'regDate': '2015-07-05T17:29:50-07:00',
        'city': 'Pinneberg',
        'age': 21
    },
    {
        'name': 'Bethany',
        'email': 'Sed.nulla.ante@sociosquadlitora.net',
        'regDate': '2015-12-23T01:47:18-08:00',
        'city': 'Idaho Falls',
        'age': 20
    },
    {
        'name': 'Jasmine',
        'email': 'id.enim.Curabitur@tellus.com',
        'regDate': '2016-11-23T15:51:48-08:00',
        'city': 'Narbonne',
        'age': 48
    },
    {
        'name': 'Brody',
        'email': 'ac.orci@facilisisnon.com',
        'regDate': '2015-11-18T20:56:24-08:00',
        'city': 'Livingston',
        'age': 30
    },
    {
        'name': 'alec',
        'email': 'in@aliquameu.org',
        'regDate': '2015-04-21T03:17:43-07:00',
        'city': 'Harlingen',
        'age': 21
    },
    {
        'name': 'Audrey',
        'email': 'Donec@Aliquamadipiscinglobortis.org',
        'regDate': '2016-12-06T20:14:43-08:00',
        'city': 'Sars-la-Buissire',
        'age': 25
    },
    {
        'name': 'Forrest',
        'email': 'leo.elementum@ridiculus.co.uk',
        'regDate': '2015-09-15T11:17:42-07:00',
        'city': 'Langholm',
        'age': 50
    },
    {
        'name': 'Jessica',
        'email': 'a.mi.fringilla@montes.net',
        'regDate': '2016-07-29T15:13:38-07:00',
        'city': 'Sioux City',
        'age': 42
    },
    {
        'name': 'Cedric',
        'email': 'Praesent.eu.nulla@tempordiamdictum.co.uk',
        'regDate': '2016-10-02T05:17:43-07:00',
        'city': 'Nazilli',
        'age': 21
    },
    {
        'name': 'Maile',
        'email': 'pharetra@Duisatlacus.edu',
        'regDate': '2016-12-29T18:47:43-08:00',
        'city': 'Salerno',
        'age': 40
    },
    {
        'name': 'acton',
        'email': 'consequat.auctor@Quisque.org',
        'regDate': '2017-01-19T05:53:38-08:00',
        'city': 'Motta Camastra',
        'age': 46
    },
    {
        'name': 'Macey',
        'email': 'faucibus@tellus.org',
        'regDate': '2015-10-30T13:07:22-07:00',
        'city': 'St. Thomas',
        'age': 40
    },
    {
        'name': 'Iona',
        'email': 'rutrum.justo@eu.org',
        'regDate': '2015-11-10T14:36:30-08:00',
        'city': 'Legal',
        'age': 48
    },
    {
        'name': 'Eve',
        'email': 'risus.Morbi@aliquameros.com',
        'regDate': '2015-12-21T09:25:33-08:00',
        'city': 'Illapel',
        'age': 42
    },
    {
        'name': 'Jayme',
        'email': 'a.nunc.In@convallisante.ca',
        'regDate': '2016-02-07T10:22:09-08:00',
        'city': 'Ville de Maniwaki',
        'age': 30
    },
    {
        'name': 'Bo',
        'email': 'posuere.cubilia.Curae@estNunclaoreet.net',
        'regDate': '2016-08-16T20:42:44-07:00',
        'city': 'Pak Pattan',
        'age': 24
    },
    {
        'name': 'Matthew',
        'email': 'enim.Mauris.quis@vehicula.edu',
        'regDate': '2015-05-01T01:53:59-07:00',
        'city': 'Alacant',
        'age': 35
    },
    {
        'name': 'Justina',
        'email': 'Donec.nibh@Vivamusmolestie.ca',
        'regDate': '2015-06-24T14:38:07-07:00',
        'city': 'Kobbegem',
        'age': 22
    }
    ];

    dataTableUsuarios = [
        {
            "nombre": "Morgan Cooper",
            "mail": "morgancooper@katakana.com",
            "telefono": "+1 (959) 459-2505"
        },
        {
            "nombre": "Ortega Gilbert",
            "mail": "ortegagilbert@katakana.com",
            "telefono": "+1 (959) 486-2805"
        },
        {
            "nombre": "Ramos Yates",
            "mail": "ramosyates@katakana.com",
            "telefono": "+1 (953) 599-3351"
        },
        {
            "nombre": "Wooten Crosby",
            "mail": "wootencrosby@katakana.com",
            "telefono": "+1 (852) 553-3467"
        },
        {
            "nombre": "Harris Downs",
            "mail": "harrisdowns@katakana.com",
            "telefono": "+1 (847) 554-3003"
        },
        {
            "nombre": "Haynes Wall",
            "mail": "hayneswall@katakana.com",
            "telefono": "+1 (830) 410-3899"
        },
        {
            "nombre": "Ryan Nolan",
            "mail": "ryannolan@katakana.com",
            "telefono": "+1 (928) 532-3912"
        },
        {
            "nombre": "Lucas Smith",
            "mail": "lucassmith@katakana.com",
            "telefono": "+1 (932) 539-2492"
        },
        {
            "nombre": "Kirkland Oneal",
            "mail": "kirklandoneal@katakana.com",
            "telefono": "+1 (965) 490-3958"
        },
        {
            "nombre": "Lillian Ross",
            "mail": "lillianross@katakana.com",
            "telefono": "+1 (918) 455-2836"
        },
        {
            "nombre": "Cornelia Dominguez",
            "mail": "corneliadominguez@katakana.com",
            "telefono": "+1 (820) 545-3140"
        },
        {
            "nombre": "Hurst Clarke",
            "mail": "hurstclarke@katakana.com",
            "telefono": "+1 (829) 539-2299"
        },
        {
            "nombre": "Nolan Hull",
            "mail": "nolanhull@katakana.com",
            "telefono": "+1 (840) 416-3085"
        },
        {
            "nombre": "Prince Guerra",
            "mail": "princeguerra@katakana.com",
            "telefono": "+1 (925) 456-2447"
        },
        {
            "nombre": "Sabrina Waters",
            "mail": "sabrinawaters@katakana.com",
            "telefono": "+1 (964) 447-3811"
        },
        {
            "nombre": "Karina Hanson",
            "mail": "karinahanson@katakana.com",
            "telefono": "+1 (805) 596-2327"
        },
        {
            "nombre": "Reyna Barker",
            "mail": "reynabarker@katakana.com",
            "telefono": "+1 (905) 525-3771"
        },
        {
            "nombre": "Aurora Jimenez",
            "mail": "aurorajimenez@katakana.com",
            "telefono": "+1 (902) 412-2032"
        },
        {
            "nombre": "Horn Albert",
            "mail": "hornalbert@katakana.com",
            "telefono": "+1 (897) 461-2733"
        },
        {
            "nombre": "Joyner Hahn",
            "mail": "joynerhahn@katakana.com",
            "telefono": "+1 (980) 402-2317"
        },
        {
            "nombre": "Dana Buckner",
            "mail": "danabuckner@katakana.com",
            "telefono": "+1 (922) 587-3987"
        },
        {
            "nombre": "Leonard Wade",
            "mail": "leonardwade@katakana.com",
            "telefono": "+1 (823) 545-2904"
        },
        {
            "nombre": "Jerry Payne",
            "mail": "jerrypayne@katakana.com",
            "telefono": "+1 (931) 506-3776"
        },
        {
            "nombre": "Glenna Yang",
            "mail": "glennayang@katakana.com",
            "telefono": "+1 (859) 548-3876"
        },
        {
            "nombre": "Fernandez Petersen",
            "mail": "fernandezpetersen@katakana.com",
            "telefono": "+1 (833) 451-3609"
        },
        {
            "nombre": "Melody Elliott",
            "mail": "melodyelliott@katakana.com",
            "telefono": "+1 (923) 529-2126"
        },
        {
            "nombre": "Coffey Contreras",
            "mail": "coffeycontreras@katakana.com",
            "telefono": "+1 (897) 524-2933"
        },
        {
            "nombre": "Deidre Beck",
            "mail": "deidrebeck@katakana.com",
            "telefono": "+1 (805) 585-2321"
        },
        {
            "nombre": "Cecile Burke",
            "mail": "cecileburke@katakana.com",
            "telefono": "+1 (883) 493-3710"
        },
        {
            "nombre": "Bianca Dorsey",
            "mail": "biancadorsey@katakana.com",
            "telefono": "+1 (868) 454-2316"
        },
        {
            "nombre": "Erica Houston",
            "mail": "ericahouston@katakana.com",
            "telefono": "+1 (964) 533-3285"
        },
        {
            "nombre": "Caldwell Mckinney",
            "mail": "caldwellmckinney@katakana.com",
            "telefono": "+1 (855) 554-3097"
        },
        {
            "nombre": "Hampton Long",
            "mail": "hamptonlong@katakana.com",
            "telefono": "+1 (927) 443-3588"
        },
        {
            "nombre": "Muriel Daniels",
            "mail": "murieldaniels@katakana.com",
            "telefono": "+1 (938) 557-2183"
        },
        {
            "nombre": "Randall Calhoun",
            "mail": "randallcalhoun@katakana.com",
            "telefono": "+1 (952) 515-2073"
        },
        {
            "nombre": "Charles Barton",
            "mail": "charlesbarton@katakana.com",
            "telefono": "+1 (956) 577-3245"
        },
        {
            "nombre": "Tucker Leach",
            "mail": "tuckerleach@katakana.com",
            "telefono": "+1 (981) 518-3426"
        },
        {
            "nombre": "Gertrude Klein",
            "mail": "gertrudeklein@katakana.com",
            "telefono": "+1 (843) 600-3715"
        },
        {
            "nombre": "Leanna Mathews",
            "mail": "leannamathews@katakana.com",
            "telefono": "+1 (954) 511-2581"
        },
        {
            "nombre": "Belinda Gomez",
            "mail": "belindagomez@katakana.com",
            "telefono": "+1 (901) 402-3366"
        },
        {
            "nombre": "Britt Burgess",
            "mail": "brittburgess@katakana.com",
            "telefono": "+1 (949) 409-3859"
        },
        {
            "nombre": "Park Robertson",
            "mail": "parkrobertson@katakana.com",
            "telefono": "+1 (833) 415-2848"
        },
        {
            "nombre": "Ramirez Tanner",
            "mail": "ramireztanner@katakana.com",
            "telefono": "+1 (940) 538-2910"
        },
        {
            "nombre": "Hyde Watson",
            "mail": "hydewatson@katakana.com",
            "telefono": "+1 (907) 401-3994"
        },
        {
            "nombre": "Bush Gallagher",
            "mail": "bushgallagher@katakana.com",
            "telefono": "+1 (924) 411-3721"
        },
        {
            "nombre": "Riggs Glover",
            "mail": "riggsglover@katakana.com",
            "telefono": "+1 (922) 507-2841"
        },
        {
            "nombre": "Ola Moses",
            "mail": "olamoses@katakana.com",
            "telefono": "+1 (953) 480-2916"
        },
        {
            "nombre": "Jeanie Pennington",
            "mail": "jeaniepennington@katakana.com",
            "telefono": "+1 (851) 491-2737"
        },
        {
            "nombre": "Cathryn Glenn",
            "mail": "cathrynglenn@katakana.com",
            "telefono": "+1 (801) 439-3620"
        },
        {
            "nombre": "Silvia Olsen",
            "mail": "silviaolsen@katakana.com",
            "telefono": "+1 (974) 493-2741"
        },
        {
            "nombre": "Lorie Moreno",
            "mail": "loriemoreno@katakana.com",
            "telefono": "+1 (936) 458-3432"
        },
        {
            "nombre": "Mathews Holmes",
            "mail": "mathewsholmes@katakana.com",
            "telefono": "+1 (975) 419-2754"
        },
        {
            "nombre": "Kaye Carney",
            "mail": "kayecarney@katakana.com",
            "telefono": "+1 (827) 414-2545"
        },
        {
            "nombre": "Winifred Preston",
            "mail": "winifredpreston@katakana.com",
            "telefono": "+1 (879) 511-2074"
        },
        {
            "nombre": "Esmeralda Sandoval",
            "mail": "esmeraldasandoval@katakana.com",
            "telefono": "+1 (894) 412-2473"
        },
        {
            "nombre": "Shelton Huff",
            "mail": "sheltonhuff@katakana.com",
            "telefono": "+1 (822) 522-2276"
        },
        {
            "nombre": "Thornton Wells",
            "mail": "thorntonwells@katakana.com",
            "telefono": "+1 (813) 560-2580"
        },
        {
            "nombre": "Jami King",
            "mail": "jamiking@katakana.com",
            "telefono": "+1 (840) 532-3258"
        },
        {
            "nombre": "Cindy Herring",
            "mail": "cindyherring@katakana.com",
            "telefono": "+1 (904) 593-3947"
        },
        {
            "nombre": "Mcknight Day",
            "mail": "mcknightday@katakana.com",
            "telefono": "+1 (979) 587-2624"
        },
        {
            "nombre": "Avis Curtis",
            "mail": "aviscurtis@katakana.com",
            "telefono": "+1 (801) 438-3350"
        },
        {
            "nombre": "Nannie Velazquez",
            "mail": "nannievelazquez@katakana.com",
            "telefono": "+1 (970) 488-3896"
        },
        {
            "nombre": "Woodward Wilcox",
            "mail": "woodwardwilcox@katakana.com",
            "telefono": "+1 (812) 446-3587"
        },
        {
            "nombre": "Allyson Farmer",
            "mail": "allysonfarmer@katakana.com",
            "telefono": "+1 (882) 406-2158"
        },
        {
            "nombre": "Brittany Frank",
            "mail": "brittanyfrank@katakana.com",
            "telefono": "+1 (985) 459-2823"
        },
        {
            "nombre": "Powell Graves",
            "mail": "powellgraves@katakana.com",
            "telefono": "+1 (990) 407-3764"
        },
        {
            "nombre": "Richmond Mcclain",
            "mail": "richmondmcclain@katakana.com",
            "telefono": "+1 (860) 574-3118"
        }
    ];

    getData(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.dataTableData);
            }, 2000);
        });
    }

    /**
     * Genera un mock de datos para la tabla usuarios
     */
    getDataMockOfUsuarios(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.dataTableUsuarios);
            }, 2000);
        });
    }
}
