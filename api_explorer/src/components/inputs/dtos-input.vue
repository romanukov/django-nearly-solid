<template>
    <div style="display: inline">
        <div class="pre" style="display: inline">
            {{ braceOpen }}
            <br>
            <template v-for="(prop, propKey) in dto.props">
                <div class="indent">
                    <span :key="propKey" style="display:inline;">
                        <span>"{{ prop.name }}":</span>
                        <Argument :show_name="false"
                                  :arg_name="prop.name"
                                  :type="prop.type"
                                  :js_type="prop.js_type"/><br>
                    </span>
                </div>
                <br>
            </template>
            {{ braceClose }}
        </div>
    </div>
</template>

<script>
import AutoWidthInput from "@/components/inputs/components/auto-width-input";
import TypeSelect from "@/components/inputs/components/type-select";


export default {
    name: "dtos-input",
    components: {AutoWidthInput, TypeSelect, Argument: () => import("@/components/argument")},
    props: {
        show_name: Boolean,
        indent: Number,
        dto: Object,
    },
    data: () => ({
        objectData: [],
    }),
    computed: {
        is_list() { return false; },
        braceOpen() { return '{'; },
        braceClose() { return '}'; },
    },
    methods: {
        onInput(key, value) {
            this.objectData[key] = value;
            this.$emit('dtoInput', this.dtoData);
        }
    },
    created() {
    }
}
</script>

<style lang="stylus" scoped>
.indent
    margin-left 4ch
    display inline-block

.pre
    font-size 13px
    display: inline

    input
        display inline
        border: 0
        min-width 1ch
        width auto
        padding 0
        margin 0
        border-radius 0
        border-bottom 2px dotted #ccc

    select
        border 0
        text-align center
</style>