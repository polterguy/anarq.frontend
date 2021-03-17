import marked from "marked";
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Markdown pipe using Marked to transform Markdown to HTML.
 */
@Pipe({
  name: 'md'
})
export class MarkdownPipe implements PipeTransform {

  transform(value: any, args?: any[]): any {

    // Sanity checking we've actually got any content before transforming to HTML.
    if (value && value.length > 0) {
      return marked(value);
    }
    return value;
  }
}