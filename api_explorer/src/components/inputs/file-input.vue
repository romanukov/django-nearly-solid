<template>
    <input type="file" class="input-text" @change="event => $emit('change', event)"/>
</template>

<script>
export default {
    name: "file-input",
    props: {
        value: Blob,
    },
}
</script>

<style lang="stylus">
input[type=file].input-text
    display inline-block

</style>