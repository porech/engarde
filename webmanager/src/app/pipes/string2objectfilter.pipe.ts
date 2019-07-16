import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'string2objectfilter',
    pure: false
})
export class StringToObjectFilterPipe implements PipeTransform {
    transform(items: any[], filter: string, itemField: string): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item[itemField].toLowerCase().indexOf(filter.toLowerCase()) !== -1);
    }
}