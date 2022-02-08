import {Pipe, PipeTransform} from '@angular/core';
import {layoutPaths} from '../..';

@Pipe({name: 'baEmpresaPicture'})
export class BaEmpresaPicturePipe implements PipeTransform {

  transform(input:string, ext = '.png'):string {
    return layoutPaths.images.empresa + input + ext;
  }
}
