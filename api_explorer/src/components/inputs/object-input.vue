<template>
    <div style="display: inline">
        <div class="pre" style="display: inline">
            {{ braceOpen }}
            <span v-if="is_list" style="font-style: italic; font-size: 10px">Array of <span class="type"><type-select :value="generic_type" @input="v => generic_type = v" /></span></span>
            <br>
            <template v-for="(obj, objKey) in objectData">
                <div class="indent">
                    <span :key="objKey" style="display:inline;">
                        <span v-if="is_list">{{ objKey }}</span>
                        <span v-if="is_dict">"</span><auto-width-input v-if="is_dict" color="#90c53a" class="name-input" :ref="'input' + objKey" :min-size="1" type="text" :value="obj.name"
                                           @input="v => obj.name = v"/><span v-if="is_dict">"</span><span class="type"
                    ><span v-if="show_type"></span><type-select v-if="show_type" :value="obj.type" @input="v => obj.type = v" /><span v-if="show_type"></span></span>:<span style="white-space: normal; vertical-align: middle"
                    ><Argument :show_name="false" :arg_name="obj.name"
                               :type="!show_type ? generic_type : obj.type"
                               :js_type="!show_type ? generic_type : obj.type"/><button class="remove">-</button><br>
                        </span>
                    </span>
                </div>
                <br>
            </template>
            <div class="indent"></div>
            <button @click="add" class="add" style="margin-top: 8px">+</button>
            <br>
            {{ braceClose }}
        </div>
    </div>
</template>

<script>
import PrimitiveInput from "@/components/inputs/primitive-input";
import AutoWidthInput from "@/components/inputs/components/auto-width-input";
import TypeSelect from "@/components/inputs/components/type-select";


export default {
    name: "object-input",
    components: {AutoWidthInput, PrimitiveInput, TypeSelect, Argument: () => import("@/components/argument")},
    props: {
        show_name: Boolean,
        indent: Number,
        is_list: Boolean,
        type: Object,
    },
    data: () => ({
        objectData: [],
    }),
    computed: {
        braceOpen() { return this.is_list ?'[' : '{'; },
        braceClose() { return this.is_list ?']' : '}'; },
        is_dict() { return !this.is_list; },
        show_type() {
            return this.is_dict || this.is_list && this.generic_type === 'Any';
        },
    },
    methods: {
        async add() {
            this.objectData.push({
                name: '',
                type: 'Any',
                generic_type: 'Any',
            });
            await this.$nextTick()
            const refKey = 'input' + String(this.objectData.length - 1);
            if (this.$refs[refKey]) {
                const lastInputElement = this.$refs[refKey][0].$el;
                lastInputElement.focus()
            }
        },
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