/** @enum {string} */ const TypesNames = {
    str: 'str',
    int: 'int',
    float: 'float',
    Symbol: 'Symbol',
    bool: 'bool',
    list: 'list',
    dict: 'dict',
    Image: 'Image',
};

class TypeData {
    /** @type {string} */ name;
    /** @type {boolean} */ is_generic;
    /** @type {boolean} */ is_entity;
    /** @type {boolean} */ is_dataclass;
    /** @type {boolean} */ is_pydantic_model;
    /** @type {boolean} */ is_django_model;
    /** @type {boolean} */ is_enum;
    /** @type {Array<TypeData>} */ generic_args;
    /** @type {Array<string>} */ enum_values;
}


function PrimitiveType(/** @type {string} */ name) {
    return {
        name,
        is_generic: false,
        is_entity: false,
        is_dataclass: false,
        is_pydantic_model: false,
        is_django_model: false,
        is_enum: false,
        generic_args: [],
        enum_values: [],
    }
}


/** @type {Object<TypesNames, TypeData>} */ const DEFAULT_TYPES_DATA = {
    [TypesNames.str]: PrimitiveType('str'),
    [TypesNames.int]: PrimitiveType('int'),
    [TypesNames.float]: PrimitiveType('float'),
    [TypesNames.Symbol]: PrimitiveType('Symbol'),
    [TypesNames.bool]: PrimitiveType('bool'),
    [TypesNames.list]: PrimitiveType('list'),
    [TypesNames.dict]: PrimitiveType('dict'),
    [TypesNames.Image]: PrimitiveType('Image'),
};


export function getDefaultValueForType(/** @type {TypeData} */ type) {
    switch (type.name) {
        case 'str':
            return '';
        case 'int':
            return 0;
        case 'float':
            return 0;
        case 'Symbol':
            return '';
        case 'boolean':
            return false;
        case 'list':
            return [];
        case 'dict':
            return {};
        case 'Image':
            return null;
    }
    if (type.is_dataclass || type.is_pydantic_model || type.is_django_model) {
        return null;
    }
    if (type.is_enum) {
        return type.enum_values[0];
    }
    throw new Error(`Bad type. Got: ${type.name}`);
}
