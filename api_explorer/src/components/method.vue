<template>
    <div class="method">
        <div class="method__title">
            <button @click="showDetails = !showDetails" class="add" style="float: right; position: relative; top: 0;">
                <template v-if="showDetails">Close</template>
                <template v-else>Open</template>
            </button>
            <h3 class="method__name">
                <span class="func" v-if="method.is_query">query</span>
                <span class="func" v-else-if="method.is_command">command</span>
                <span class="func" v-else>def</span>
                {{ method.name }}<span class="brace">(</span><template v-for="(argument, index) in method.args">
                    <span><span class="arg">{{ argument.name }}</span>: <span class="type"><type-name :type="argument.type" /></span></span>
                    <span v-if="index !== Object.keys(method.args).length - 1">, </span>
                </template><span class="brace">)</span>
                <span v-if="method.return_type !== 'undefined'"> -> <type-name :type="method.return_type" /></span>
            </h3>
            <p class="method__description" v-if="method.description_lines && method.description_lines.length">
                <template v-for="line in method.description_lines">
                    {{ line }}<br>
                </template>
            </p>
        </div>
        <div class="method__body" v-show="showDetails">
            <span class="method__description" v-if="method.returns_description">
                @returns {{ method.returns_description }}
            </span>

            <hr>

            <h5>Input:</h5>
            <template v-for="(argument, argumentIndex) in method.args">
                <span class="arg">{{ argument.name }}</span>:
                <argument :key="argumentIndex"
                          :arg_name="argument.name"
                          style="display: inline"
                          :type="argument.type"
                          v-model="args[argument.name]"
                          :is_generic="argument.is_generic"
                          :js_type="argument.type.name" />
                <br>
            </template>
            <button class="execute-button" @click="executeMethod(serviceName, method.name)">Execute method</button>
            <div class="method__output">
                <h5>Output:</h5>
                <pre></pre>
            </div>
        </div>
    </div>
</template>

<script>
import Argument from "@/components/argument";
import TypeName from "@/components/type-name";
import {getDefaultValueForType} from "@/common/utils";


export default {
    name: "method",
    data: () => ({
        showDetails: false,
        args: {},
    }),
    props: {
        method: Object,
    },
    methods: {
        defaultValueFor() {},
    },
    components: {
        Argument,
        TypeName,
    },
    created() {
        console.log('method', this.method);
        for (const argument of this.method.args) {
            this.args[argument.name] = getDefaultValueForType(argument.type)
        }
    }
}
</script>

<style lang="stylus">
.execute-button
    display block
    width 100%
    margin 16px 0
    padding 8px 0
</style>