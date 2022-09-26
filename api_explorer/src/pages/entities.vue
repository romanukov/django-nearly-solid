<template>
    <div class="entities-page">
        <h1>Entities</h1>
        <div v-show="isEntityVisible(entity)" :id="`DTO__` + entity.name" v-for="(entity, entityIndex) in entities" class="entity">
            <h2 class="entity__title">
                <span class="class">{{ entityTypeName(entity) }} </span>
                <a :href="'#DTO__' + entity.name">{{ getTypeName(entity) }}</a>
                <div style="display: inline-block; margin-left: 16px">
                    <span v-if="entity.type.is_technical">(technical)</span>
                </div>
            </h2>
            <pre style="white-space: pre-line"><div
                class="enum-value" v-for="val in entity.type.enum_values">{{ val }} : {{ val }}</div><template
                v-for="prop in entity.props">{{ prop.name }}: <type-name :type="prop.type" />
                </template></pre>
        </div>
    </div>
</template>

<script>
import TypeName from "@/components/type-name";

export default {
    name: "entities",
    computed: {
        entities() { return this.$store.state.entities; },
        config() { return this.$store.state.config; },
    },
    methods: {
        entityTypeName(entity) {
            if (this.config.show_entities_details) {
                if (entity.type.is_enum) return 'enum';
                if (entity.type.is_dataclass) return 'dataclass';
                if (entity.type.is_django_model) return 'django model';
                if (entity.type.is_pydantic_model) return 'pydantic model';
            }
            return 'class'
        },
        getTypeName(typeData) {
            let typeName = typeData.name;
            if (typeData.is_generic) {
                const genericArgs = '<' + typeData.generic_args.join(', ') + '>';
                typeName += genericArgs;
            }
            return typeName;
        },
        isEntityVisible(entity) {
            const isTechnical = entity.type.is_technical;
            const showBecauseTechnical = isTechnical && this.config.show_technical_entities || !isTechnical;
            return showBecauseTechnical;
        },
    },
    components: { TypeName },
}
</script>

<style lang="stylus">
pre
    background #333
</style>