<template>
    <span>
        "<auto-width-input :min-size="15" v-bind="$props" :value="value" @input="v => $emit('input', v)"
               type="text" class="input-text" placeholder="Enter string..."/>"
    </span>
</template>

<script>
import AutoWidthInput from "@/components/inputs/components/auto-width-input";
export default {
    name: "string-input",
    components: {AutoWidthInput},
    props: {
        value: String,
    },
}
</script>

<style lang="stylus">
input
    padding 0
    border 0
    border-bottom 2px dotted #222
    margin 0
    display inline
</style>