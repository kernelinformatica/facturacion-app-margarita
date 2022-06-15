import { Injectable } from "@angular/core";
import { saveAs } from 'file-saver';
import  JSZipUtils from "jszip-utils";
import  JSZip from "jszip";
import  Docxtemplater from 'docxtemplater';


@Injectable()
export class FilesService {
    
    constructor() { }

    
    loadFile = (url,callback) => {
        JSZipUtils.getBinaryContent(url,callback);
    }

    generateDoc = (file, varsToReemplace) => {
        let zip = new JSZip(file);

        let doc = new Docxtemplater();
        
        doc.loadZip(zip)

        
        doc.setData(varsToReemplace);

        try {
            doc.render()
        }
        catch (error) {
            let e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            
            throw error;
        }

        let out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })

        saveAs(out,"output.docx")
        

    }

    // test = () => {
    //     this.loadFile("https://docxtemplater.com/tag-example.docx",function(error,content){
    //         if (error) { throw error };
    //         var zip = new JSZip(content);
    //         var doc = new Docxtemplater();
    //         doc.loadZip(zip)
            
    //         doc.setData({
    //             first_name: 'John',
    //             last_name: 'Doe',
    //             phone: '0652455478',
    //             description: 'New Website'
    //         });

    //         try {
    //             // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    //             doc.render()
    //         }
    //         catch (error) {
    //             var e = {
    //                 message: error.message,
    //                 name: error.name,
    //                 stack: error.stack,
    //                 properties: error.properties,
    //             }
    //             console.log(JSON.stringify({error: e}));
    //             // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
    //             throw error;
    //         }
    //         var out = doc.getZip().generate({
    //             type:"blob",
    //             mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //         }) //Output the document using Data-URI

    //         saveAs(out,"output.docx")
    //     })
    // }
    

}