import { Binder } from '../binder';
import { Key } from '../Key';
import { Nullable } from '../types';
import { AnnotationConstructor } from './Annotation';
import { AnnotationKey, Annotations, Target } from './Annotations';
import { BindingAnnotation } from './BindingAnnotation';
import { InjectAnnotation } from './InjectAnnotation';
import { SingletonAnnotation } from './SingletonAnnotation';

interface BindToScopeOptions {
  binder: Binder;
  fn: Function;
  keys: Nullable<Array<Key>>;
  target: Target;
  scope?: SingletonAnnotation;
}

export class ProvidesAnnotation extends BindingAnnotation {
  public static _name = 'ProvidesAnnotation';

  bind(binder: Binder, target: Target, targetKey: AnnotationKey): void {
    const fn = target[targetKey] as Function | undefined;

    if (!fn) {
      throw new Error(`Cannot bind. No function found for ${String(targetKey)} on ${target}`);
    }

    // TODO: How to avoid needing to type cast like this?
    const scope = Annotations.hasAnnotation(SingletonAnnotation as AnnotationConstructor<SingletonAnnotation>, target, targetKey)
      ? Annotations.getAnnotation<SingletonAnnotation>(SingletonAnnotation as AnnotationConstructor<SingletonAnnotation>, target, targetKey)
      : undefined;

    const fnLength = fn.length;

    if (fnLength === 0) {
      return this.bindToScope({ binder, fn, scope, target, keys: null });
    }

    if (!Annotations.hasAnnotation(InjectAnnotation as AnnotationConstructor<InjectAnnotation>, target, targetKey)) {
      throw new Error(`@Provides function has unsatisfied parameters, @Inject is missing for key ${String(targetKey)} in target ${target}`);
    }

    const inject = Annotations.getAnnotation(InjectAnnotation as AnnotationConstructor<InjectAnnotation>, target, targetKey);
    const keysLength = inject.getKeys().length;

    if (keysLength !== fnLength) {
      throw new Error(`@Provides function has unsatisfied parameters. @Inject specifies ${keysLength} keys and function expects ${fnLength} parameters`);
    }

    return this.bindToScope({ binder, fn, scope, target, keys: inject.getKeys() });
  }

  private bindToScope({ binder, fn, keys, scope, target }: BindToScopeOptions): void {
    binder.bindKey(this.key).toProvider(fn.bind(target), keys, this.asPromise).in(scope);
  }
}
