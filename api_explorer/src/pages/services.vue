<template>
    <div class="services-page">
        <h1>Services</h1>
        <div v-for="(service, serviceName) in services" class="service">
            <h2 class="service__title"><span class="class">service</span> {{ service.name }}</h2>
            <method v-for="(method, methodIndex) in service.methods" :key="methodIndex" :method="method" />
        </div>
    </div>
</template>

<script>
import Method from "@/components/method";

export default {
    name: "services",
    computed: {
        services() {
            return this.$store.state.services;
        }
    },
    components: { Method },
}
</script>

<style scoped>

</style>