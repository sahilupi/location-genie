// highlight.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, filter: string): string {
    if (!filter) {
      return value;
    }

    const escapedFilter = filter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedFilter, 'gi');

    return value.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`
    );
  }
}
