import { AnnotationKey, Target } from '../annotations/Annotations';
import { BindingAnnotation } from '../annotations/BindingAnnotation';
import { ProvidesAnnotation } from '../annotations/ProvidesAnnotation';
import { Binder, ListBinder } from '../binder';

export class ProvidesToListAnnotation extends BindingAnnotation {
  static _name = 'ProvidesToListAnnotation';

  private readonly _sortOrder?: number;

  constructor(key: string, sortOrder?: number, asPromise?: boolean) {
    super(key, asPromise);
    this._sortOrder = sortOrder;
  }

  bind(binder: Binder, target: Target, targetKey: AnnotationKey) {
    const listBinder = ListBinder.get(binder, this._key) as ListBinder;
    const itemKey = listBinder._getKey(this._sortOrder);
    new ProvidesAnnotation(itemKey, this._asPromise).bind(listBinder, target, targetKey);
  }
}
