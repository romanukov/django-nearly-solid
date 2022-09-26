<template>
    <div class="settings-page">
        <h1>Settings</h1>
        <h2>Entities</h2>
        <label>
            <input type="checkbox" v-model="show_technical_entities" />
            Show technical entities
        </label>
        <label>
            <input type="checkbox" v-model="show_entities_details" />
            Show entities details
        </label>
    </div>
</template>

<script>
function mapConfig(key) {
    return {
        get() { return this.$store.state.config[key] },
        set(value) { return this.$store.commit('setConfig', { key, value }) },
    }
}


export default {
    name: "settings",
    computed: {
        show_technical_entities: mapConfig('show_technical_entities'),
        show_entities_details: mapConfig('show_entities_details'),
    },
}
</script>

<style scoped>

</style>