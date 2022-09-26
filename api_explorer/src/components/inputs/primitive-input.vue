<template>
    <div style="display: inline">
        <span v-if="show_name">{{ name }} [{{ typeName }}]:</span>
        <string-input
            :value="value" v-on="$listeners"
            v-if="typeName === 'string'" />
        <number-input
            :value="value" v-on="$listeners"
            v-else-if="typeName === 'number'" />
        <boolean-input
            :value="value" v-on="$listeners"
            v-else-if="typeName === 'boolean'" />
        <file-input
            v-else-if="typeName === 'Blob'"
            :value="value"
            @change="$emit('input', $event.target.files[0])"/>
        <file-input
            v-else-if="typeName === 'Image'"
            :value="value"
            @change="$emit('input', $event.target.files[0])"/>
        <span v-else style="color: #b92a5c">!!!No input for {{ typeName }}!!!</span>
    </div>
</template>

<script>

import StringInput from "@/components/inputs/string-input";
import NumberInput from "@/components/inputs/number-input";
import BooleanInput from "@/components/inputs/boolean-input";
import FileInput from "@/components/inputs/file-input";
import {typesResolves} from "@/types";


export default {
    name: "argument-input",
    props: ['name', 'value', 'js_type', 'show_name'],
    computed: {
        typeName() {
            if (Object.keys(typesResolves).includes(this.js_type)) {
                return typesResolves[this.js_type];
            }
            return this.js_type;
        },
    },
    components: {
        StringInput,
        NumberInput,
        BooleanInput,
        FileInput,
    },
}
</script>

<style lang="stylus">

</style>