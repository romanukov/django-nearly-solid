<template>
    <span style="padding-left: 1ch">
        <auto-width-input :min-size="15" v-bind="$props"
                          :value="value" @input="value => $emit('input', value)"
                          type="number" class="input-text" placeholder="Enter number..."/>
    </span>
</template>

<script>
import AutoWidthInput from "@/components/inputs/components/auto-width-input";
export default {
    name: "number-input",
    components: {AutoWidthInput},
    props: {
        value: Number,
    },
}
</script>

<style lang="stylus" scoped>
input
    padding 0
    border 0
    border-bottom 2px dotted #222
    margin 0
    display inline

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>