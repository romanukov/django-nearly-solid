<template>
    <div style="display: inline"><dto-input
            :show_name="show_name"
            v-if="isDTO"
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
        <primitive-input
            :show_name="show_name"
            v-else
            :name="arg_name"
            :js_type="type"
            v-model="value" /></div>

</template>

<script>
import dtoInput from "@/components/inputs/dtos-input";
import primitiveInput from "@/components/inputs/primitive-input";
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
        ObjectInput,
        dtoInput,
        primitiveInput,
    },
}
</script>

<style scoped>

</style>