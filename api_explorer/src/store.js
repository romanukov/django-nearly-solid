import Vuex from 'vuex'

export const store = () => new Vuex.Store({
    state() {
        return {
            entities: null,
            services: null,
            config: {
                show_technical_entities: true,
                show_entities_details: true,
            },
        }
    },
    mutations: {
        setEntities(state, entities) { state.entities = entities; },
        setServices(state, services) { state.services = services; },

        loadConfig(state) {
            const jsonData = localStorage.getItem('ns_config');
            if (!jsonData) return;
            const data = JSON.parse(jsonData);
            if (!data) return;
            state.config = data;
        },
        setConfig(state, { key, value }) {
            state.config[key] = value;
            const jsonData = JSON.stringify(state.config);
            localStorage.setItem('ns_config', jsonData);
        },
    },
})
