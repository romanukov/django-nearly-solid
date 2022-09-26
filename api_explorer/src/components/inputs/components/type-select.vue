<template>
    <span class="type">
        &lt;<select
                class="type"
                ref="select"
                :value="value"
                @input="onInput"
                style="width:10ch;height:20px;font-size:10px;">

            <option value="Any">Any</option>
            <option value="String" selected>String</option>
            <option value="Boolean">Boolean</option>
            <option value="Number">Number</option>
            <option value="Object">Object</option>
            <option value="Array">Array</option>
            <option v-for="(entity, entityKey) in entitiesData" :key="entityKey" :value="entity.name">
                {{ entity.name }}
            </option>
        </select>&gt;
    </span>
</template>

<script>
export default {
    name: "type-select",
    props: ['value'],
    methods: {
        onInput(event) {
            this.$emit('input', event.target.value);
            this.resizeSelect(event.target.value);
        },
        resizeSelect(value) {
            this.$refs.select.style.width = 12 * value.length + 'px';
        },
    },
    computed: {
        entitiesData() {
            return this.$store.state.models;
        },
    },
    created() {
        console.log('KEK', this.$store.state.models)
    }
}
</script>

<style lang="stylus" scoped>
select
    border 0
</style>