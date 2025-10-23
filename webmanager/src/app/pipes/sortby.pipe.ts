import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'sortBy',
    pure: false,
    standalone: false
})
export class SortByPipe implements PipeTransform {
    transform(items: any[], sortField: any): any {
        if (!items || !sortField) {
            return items;
        }
        return items.sort((item1, item2) => {
            return item1[sortField] > item2[sortField] ? 1 : -1;
        });
    }
}