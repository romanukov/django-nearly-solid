<template>
    <span class="type-name">
        {{ resolveName(type.name) }}<span class="type-name__generic-args"><span v-html="genericArgs(type)"></span>
        </span>
    </span>
</template>

<script>
import {typesResolves} from "@/types";

export default {
    props: {
        type: Object,
    },
    name: "type-name",
    methods: {
        resolveName(typeName) {
            if (Object.keys(typesResolves).includes(typeName)) {
                return typesResolves[typeName];
            }
            return typeName;
        },
        genericArgs(type) {
            if (type.is_generic) {
                let result = [];
                for (const genericArg of type.generic_args) {
                    if (!genericArg.name) {
                        result.push(genericArg);
                        continue;
                    }
                    let name = this.resolveName(genericArg.name);
                    console.log(Object.keys(typesResolves), name)
                    if (genericArg.is_model) {
                        name = `<a href="#DTO__${name}">${name}</a>`
                    }
                    if (genericArg.is_generic) {
                        const genericArgsOfGenericArg = this.genericArgs(genericArg);
                        name += genericArgsOfGenericArg;
                    }
                    result.push(name)
                }

                return '‹' + result.join(', ') + '›';
            }
            return '';
        }
    }
}
</script>

<style lang="stylus">
</style>