import { ConnectableObservable } from 'rxjs';

class DataSource {
}
/** Checks whether an object is a data source. */
function isDataSource(value) {
    // Check if the value is a DataSource by observing if it has a connect function. Cannot
    // be checked as an `instanceof DataSource` since people could create their own sources
    // that match the interface, but don't extend DataSource. We also can't use `isObservable`
    // here, because of some internal apps.
    return value && typeof value.connect === 'function' && !(value instanceof ConnectableObservable);
}

export { DataSource, isDataSource };
//# sourceMappingURL=data-source.mjs.map
