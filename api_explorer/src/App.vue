<template>
    <div id="app">
        <ul class="menu">
            <router-link tag="li" to="/services/" active-class="--active" class="menu__item">Services</router-link>
            <router-link tag="li" to="/entities/" active-class="--active" class="menu__item">Entities</router-link>
            <router-link tag="li" to="/settings/" active-class="--active" class="menu__item">Settings</router-link>
        </ul>
        <router-view />
    </div>
</template>

<script>
export default {
    methods: {
        async getApplicationData() {
            const response = await fetch('http://localhost:8000/application_data/');
            return response.json();
        },
    },
    async created() {
        const { services, entities } = await this.getApplicationData();
        this.$store.commit('setEntities', entities);
        this.$store.commit('setServices', services);
        this.$store.commit('loadConfig')
    },
}

</script>


<style lang="stylus">

tag($color)
    border-bottom 2px solid $color
    color $color
    font-size 11px
    display inline-block
    font-weight bold
    padding 4px
    line-height 1

.tag
    & + &
        margin-left 16px

.model-tag
    tag(#88ffff)

.dataclass-tag
    tag(#ff6c6c)

.pydantic-tag
    tag(#ababf5)

.django-tag
    tag(#8fff8f)

.enum-tag
    tag(#ffa256)

.tech-tag
    tag(#9d9d9d)


.enum-value
    $color = white

    border-bottom 1px solid $color
    color $color
    font-size 14px
    display inline-block
    padding 4px

    & + &
        margin-left 16px

.class
    color: #d24398
    font-weight: 400
    font-style: italic

label
    display block

.menu
    display flex
    flex-direction row
    padding 0

    &__item
        display block
        padding 8px 16px
        border 1px solid #d24398
        cursor pointer
        transition .1s

        &:hover, &.--active
            background #d24398
            color white

        & + &
            margin-left 16px
</style>
