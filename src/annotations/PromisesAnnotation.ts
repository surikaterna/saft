import { ProvidesAnnotation } from '../annotations/ProvidesAnnotation';

export class PromisesAnnotation extends ProvidesAnnotation {
  static _name = 'PromisesAnnotation';

  constructor(key: string) {
    super(key, true);
  }
}
