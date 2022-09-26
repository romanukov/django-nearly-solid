<template>
    <input v-bind="$props" class="auto-width-input" :value="value" :style="`width: ${width}ch; color: ${color || '#ccc'}`" @input="onInput($event)" />
</template>

<script>
export default {
    name: "auto-width-input",
    props: {
        value: String|Number,
        minSize: Number,
        type: String,
        color: String|undefined,
    },
    data: () => ({
        width: 1,
    }),
    methods: {
        onInput(event) {
            let addSigns = 0;
            let targetValue = event.target.value;
            if (this.type === 'number') {
                addSigns += 2;
                targetValue = Number(targetValue);
            }
            console.log('EVENT', event.target.value);
            this.$emit('input', targetValue);
            console.log('EVENT', event.target.value);
            this.width = String(event.target.value || '1'.repeat(this.minSize || 1)).length + addSigns;
        }
    },
    created() {
        let addSigns = 0;
        if (this.type === 'number') {
            addSigns += 2;
        }
        this.width = (this.minSize || this.value.length) + addSigns;
    }
}
</script>

<style lang="stylus" scoped>
.auto-width-input
    width 1ch
    display inline
    border-radius 0

input:focus, textarea:focus, select:focus {
    outline none
    background #333
    color #f1f1f1 !important
}

</style>