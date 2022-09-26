

export class TypeData {
    /** @type {string} */ name;
    /** @type {boolean} */ is_generic;
    /** @type {Array<TypeData>} */ generic_args;

    constructor({ name, is_generic, generic_args }) {
        this.name = name;
        this.is_generic = is_generic;
        this.generic_args = generic_args.map(t => new TypeData(t));
    }
}


export class PropData {
    /** @type {string} */ name;
    /** @type {TypeData} */ type;
    /** @type {boolean} */ required;
    /** @type {any} */ default_value;

    constructor({ name, type, required, default_value }) {
        this.name = name;
        this.type = new TypeData(type);
        this.required = required;
        this.default_value = default_value;
    }
}


export class MethodData {
    /** @type {string} */ name;
    /** @type {Array<PropData>} */ args;
    /** @type {TypeData} */ return_type;
    /** @type {boolean} */ auth_required;
    /** @type {boolean} */ set_auth_token;
    /** @type {boolean} */ upload_image;
    /** @type {boolean} */ returns_png;
    /** @type {boolean} */ is_query;

    constructor({ name, args, return_type, auth_required, set_auth_token, upload_image, returns_png, is_query }) {
        this.name = name;
        this.args = args.map(arg => new PropData(arg));
        this.return_type = new TypeData(return_type);
        this.auth_required = auth_required;
        this.set_auth_token = set_auth_token;
        this.upload_image = upload_image;
        this.returns_png = returns_png;
        this.is_query = is_query;
    }
}


export class ServiceData {
    /** @type {string} */ name;
    /** @type {Array<MethodData>} */ methods;

    constructor({ name, methods }) {
        this.name = name;
        this.methods = methods.map(method => new MethodData(method));
    }
}


export class ModelData {
    /** @type {string} */ name;
    /** @type {Array<PropData>} */ props;

    constructor({ name, props }) {
        this.name = name;
        this.props = props.map(prop => new PropData(prop));
    }
}


export class ApplicationData {
    /** @type {Array<ModelData>} */ models;
    /** @type {Array<ServiceData>} */ services;

    constructor({ models, services }) {
        this.models = models.map(model => new ModelData(model));
        this.services = services.map(service => new ServiceData(service));
    }
}


export class Error {
    /** @type {string} */ error_code;
    /** @type {any} */ data;

    constructor({ error_code, data }) {
        this.error_code = error_code;
        this.data = data;
    }
}


export class Result {
    /** @type {boolean} */ ok;
    /** @type {any|undefined} */ body;
    /** @type {Array<Error>} */ errors;

    constructor({ ok, body, errors }) {
        this.ok = ok;
        this.body = body;
        this.errors = errors;
    }
}
