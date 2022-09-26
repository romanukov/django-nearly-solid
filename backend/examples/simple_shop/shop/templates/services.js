{% if export %}export {% endif %}class ServerLogicError extends Error {
    constructor(/** @type {string} */ errorCode, /** @type {any} */ errorData, /** @type {string|undefined} */ errorCls) {
        console.log(errorCode, errorData, errorCls);
        super(errorCode + '\n' + JSON.stringify(errorData));
        this.name = 'ServerLogicError';
        this.code = errorCode;
        this.data = errorData;
        this.cls = errorCls;
    }
}


{% if export %}export {% endif %}async function getBase64Image(blob) {
    const reader = new FileReader();
    await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
    return reader.result;
}


{% for entity in entities %}
{% if export %}export {% endif %}class {{ entity.name }} {
    /**
     {%- for prop in entity.props %}
     * {{ prop.docstring_line }}
     {%- endfor %}
     */

    constructor({ {% for prop in entity.props %}{{ prop.name }}, {% endfor %} }) {
        {% for prop in entity.props -%}
        this.{{ prop.name }} = {{ prop.name }};
        {% endfor %}
    }
}
{% endfor %}


{% if export %}export {% endif %}let SERVER_URL = '';

{% if export %}export {% endif %}const services = {
{%- for service_name, service in services.items() %}
{{ service_name }}: {
    {%- for method in service.methods %}
    {{ method.name }}: async function (
        {%- for argument in method.arguments %}{{ argument.type_jsdoc }} {{ argument.name -}}, {% endfor %}) {
        /**
         {% for line in method.description_lines -%}
         * {{ line }}
         {% endfor -%}
         {%- if method.return_type -%}
         * {{ method.returns_jsdoc }} {{ method.returns_description }}
         {% endif -%}
         * */
        const requestBody = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',

                {%- if method.auth_required %}
                'Authorization': localStorage.getItem('auth_token'),
                {%- endif %}
            },
        };

        {%- if method.upload_image %}
        const args = [];
        {%- for argument in method.arguments %}
        {% if argument.js_type == 'Blob' %}
        args.push(await getBase64Image({{ argument.name }}));
        {% else %}
        args.push({{ argument.name }});
        {% endif %}
        {%- endfor %}
        console.log('{{ service_name }}.{{ method.name }} formData', args);
        {%- else %}
        const args = [...arguments];
        {%- endif %}
        requestBody.body = JSON.stringify(args);
        const response = await fetch(SERVER_URL + '/api/v1/{{ service_name }}/{{ method.name }}/', requestBody);
        console.log(response.headers.get('Content-Type'));
        if (response.headers.get('Content-Type') === 'image/png') {
            return await response.blob();
        } else {
            const json = await response.json();
            if (json.success) {
                {% if method.set_auth_token %}
                localStorage.setItem('auth_token', json.result);
                {% endif %}
                /** {{ method.return_type }} */
                {% if method.return_type.name.endswith('DTO') %}
                const result = new {{ method.return_type.python_name }}(json.result);
                {% else %}
                const result = json.result;
                {% endif %}
                return result;
            }

            console.log('ERROR!', json)
            throw new ServerLogicError(json.error_code, json.error_data, json.error_class);
        }
    }

,
    {% endfor %}
},
{% endfor %}
}


/**
 * Enum со всеми возможными именами сообщений
 * @readonly
 * @enum {string}
 */
{% if export %}export {% endif %}const MessagesTypes = {
{% for message_type in messages_types %}
    {{ message_type }}: '{{ message_type }}',
{% endfor %}
}


{% if export %}export {% endif %}const messages = {
    listeningMessages: {},  /** @type {Object<MessagesTypes, Function<object>>} */
    started: false,

    startListenLoop: async function startListenLoop() {
        if (this.started) return;
        this.started = true;
        while (this.started) {
            await sleep(3000);
            for (const messageType in MessagesTypes) {
                if (!(messageType in this.listeningMessages)) continue;
                const messages = await this._request(messageType);
                if (!messages) continue;
                for (const message of messages) {
                    this.listeningMessages[messageType](message.data);
                }
            }
        }
    },

    subscribe: async function subscribe(/** @type {MessagesTypes} */ messageType, /** @type {Function<object>} */ callback) {
        this.listeningMessages[messageType] = callback;
    },

    describe: function describe(messageType) {
        if (messageType in this.listeningMessages) {
            delete this.listeningMessages[messageType];
        }
    },

    _request: async function request(messageType) {
        const requestBody = {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('auth_token'),
            },
        };
        try {
            const response = await fetch(`/api/v1/messages/${messageType}/`, requestBody);

            if (response.status === 200) {
            } else {
                throw new Error('Unknown error with server events response:' + response)
            }
            return await response.json();
        } catch (err) {
            console.error(`Handled error for ${messageType}`, err);
            throw err;
        }
    },
}
messages.startListenLoop();


{% if export %}export {% endif %}const servicesData = {{ services_data | safe }};
{% if export %}export {% endif %}const entitiesData = {{ entities_data | safe }};

{% if export %}export {% endif %}async function sleep(ms) {
    return new Promise(resolve => { setTimeout(resolve, ms) })
}
