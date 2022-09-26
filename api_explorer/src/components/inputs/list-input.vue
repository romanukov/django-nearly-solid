<template>
    <table>
        <thead>
            <tr>
                <td></td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(obj, objKey) in objectData" :key="objKey">
                <td>
                    <Argument :show_name="false" :arg_name="''" :type="obj.type" :js_type="obj.type" />
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <button @click="add" style="width: 100%">+</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import PrimitiveInput from "@/components/inputs/primitive-input";


export default {
    name: "object-input",
    components: { PrimitiveInput, Argument: () => import("@/components/argument") },
    props: {
        show_name: Boolean,
        type: String,
    },
    data: () => ({
        objectData: [],
    }),
    methods: {
        add() {
            this.objectData.push({
                name: '',
                type: 'string',
            })
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

<style scoped>

</style>