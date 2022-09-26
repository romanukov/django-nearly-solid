<template>
    <input v-bind="$props" :value="value" @input="event => $emit('input', event.target.value)"
           type="checkbox"/>
</template>

<script>
export default {
    name: "boolean-input",
    props: {
        value: Boolean,
    },
}
</script>

<style scoped>

</style>