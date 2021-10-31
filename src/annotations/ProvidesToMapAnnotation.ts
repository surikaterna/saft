import { AnnotationKey, Target } from '../annotations/Annotations';
import { BindingAnnotation } from '../annotations/BindingAnnotation';
import { ProvidesAnnotation } from '../annotations/ProvidesAnnotation';
import { Binder, MapBinder } from '../binder';

export class ProvidesToMapAnnotation extends BindingAnnotation {
  private readonly _itemKey: string;

  constructor(key: string, itemKey: string, asPromise?: boolean) {
    super(key, asPromise);

    this._itemKey = itemKey;

    if (!key || !itemKey) {
      throw new Error(`Unable to bind to map with key ${key}, itemKey ${itemKey}`);
    }
  }

  bind(binder: Binder, target: Target, targetKey: AnnotationKey) {
    const mapBinder = MapBinder.get(binder, this._key);
    new ProvidesAnnotation(this._itemKey, this._asPromise).bind(mapBinder, target, targetKey);
  }
}
