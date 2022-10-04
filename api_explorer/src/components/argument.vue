<template>
    <div style="display: inline">
        <span v-if="show_name">{{ name }} [{{ typeName }}]:</span>
        <string-input
            :value="value"
            @input="() => $emit('input', $event.target.value)"
            v-if="typeName === 'string'" />
        <number-input
            :value="value" @input="(value) => $emit('input', value)"
            v-model.number="value"
            v-else-if="typeName === 'number'" />
        <boolean-input
            :value="value" @input="(value) => $emit('input', value)"
            v-else-if="typeName === 'boolean'" />
        <file-input
            v-else-if="typeName === 'Blob'"
            :value="value"
            @change="$emit('input', $event.target.files[0])"/>
        <file-input
            v-else-if="typeName === 'Image'"
            :value="value"
            @change="$emit('input', $event.target.files[0])"/>
        <dto-input
            :show_name="show_name"
            v-else-if="isDTO"
            :type="type"
            @dtoInput="value = $event"
            :dto="getDTO" />
        <object-input
            :is_list="false"
            :show_name="show_name"
            v-else-if="isObject"
            :name="arg_name"
            :type="type"
            :generic_type="''"
            @input="value = $event" />
        <object-input
            :is_list="true"
            :show_name="show_name"
            v-else-if="isList"
            :name="arg_name"
            :type="type"
            :generic_type="generic_type"
            @input="value = $event" />
        <span v-else style="color: #b92a5c">!!!No input for {{ typeName }}!!!</span>
    </div>
</template>

<script>
import StringInput from "@/components/inputs/string-input";
import NumberInput from "@/components/inputs/number-input";
import BooleanInput from "@/components/inputs/boolean-input";
import FileInput from "@/components/inputs/file-input";
import dtoInput from "@/components/inputs/dtos-input";
import ObjectInput from "@/components/inputs/object-input";
import {typesResolves} from "@/types";

export default {
    name: "argument",
    props: {
        arg_name: String,
        js_type: String,
        type: Object,
        show_name: Boolean,
    },
    data: () => ({
        value: null,
    }),
    computed: {
        typeName() {
            if (Object.keys(typesResolves).includes(this.type.name)) {
                return typesResolves[this.type.name];
            }
            return this.type.name;
        },
        entitiesData() { return entitiesData; },
        isDTO() {
            return this.type.is_model;
        },
        isObject() {
            return this.typeName === 'Object';
        },
        isList() {
            return this.typeName === 'Array'   ;
        },
        getDTO() {
            if (!this.type.name.endsWith('DTO')) return null;
            for (const dtoKey in this.entitiesData) {
                const dto = this.$root.entities[dtoKey];
                if (dto.name === this.type.name) {
                    console.log(dto)
                    return dto;
                }
            }
            return null;
        },
    },
    components: {
        StringInput,
        NumberInput,
        BooleanInput,
        FileInput,
        ObjectInput,
        dtoInput,
    },
}
</script>

<style scoped>

</style>