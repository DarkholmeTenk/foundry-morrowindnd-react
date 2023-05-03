import {getMappedSetter, StateSetter, useMappedSetter} from "Util/React/update/Updater";

interface FieldData<T> {
    get<K extends keyof T & string>(field: K, label?: string): FieldProps<T[K]>
}
export interface FieldProps<U> {
    value: U,
    setter: StateSetter<U>,
    label: string
}

export function getFieldData<T>(value: T, setter: StateSetter<T>): FieldData<T> {
    return {
        get: function <K extends keyof T & string>(key: K, label: string = key) {
            let fieldValue = value[key]
            let fieldSetter = getMappedSetter(key, setter)
            return {
                value: fieldValue,
                setter: fieldSetter,
                label
            }
        }
    }
}