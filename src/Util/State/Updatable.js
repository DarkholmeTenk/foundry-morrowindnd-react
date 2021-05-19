export function Updatable(target, propertyKey, descriptor) {
    let originalMethod = descriptor.value;
    let method = function () {
        let result = originalMethod.bind(this)(...arguments);
        if (this._updateFunction)
            this._updateFunction(result);
        return result;
    };
    return {
        ...descriptor,
        value: method
    };
}
export function UpdatableProvider(onUpdate) {
    let getDecorator = (updater) => {
        return function (target, propertyKey, descriptor) {
            let realMethod = descriptor.value || descriptor.getter;
            let newFunction = function () {
                let result = realMethod.bind(this)(...arguments);
                result._updateFunction = (newValue) => updater(this, newValue, arguments);
                return result;
            };
            let newDescriptor = { ...descriptor };
            if (descriptor.getter)
                newDescriptor.getter = newFunction;
            if (descriptor.value)
                newDescriptor.value = newFunction;
            return newDescriptor;
        };
    };
    let Replace = (fieldName) => {
        return getDecorator((x, newValue) => {
            let data = { ...x.data };
            data[fieldName] = newValue;
            onUpdate(x, data);
        });
    };
    let ArrayElement = (fieldName) => {
        return getDecorator((x, newValue, args) => {
            let index = args[0];
            let data = { ...x.data };
            let array = [...data[fieldName]];
            array[index] = newValue;
            data[fieldName] = array;
            onUpdate(x, data);
        });
    };
    let ObjectField = (fieldName) => {
        return getDecorator((x, newValue, args) => {
            let index = args[0];
            let data = { ...x.data };
            let obj = { ...data[fieldName] };
            obj[index] = newValue;
            data[fieldName] = obj;
            onUpdate(x, data);
        });
    };
    let Setter = function (target, propertyKey) {
        let newDescriptor = {
            get: function () {
                return this.data[propertyKey];
            },
            set: function (newValue) {
                let data = { ...this.data, [propertyKey]: newValue };
                onUpdate(this, data);
            }
        };
        Object.defineProperty(target, propertyKey, newDescriptor);
    };
    return { Replace, ArrayElement, ObjectField, Setter };
}
