<template>
    <div class="app">
        <h1>app.vue</h1>
        <button @click="click">{{state.count}}</button>
    </div>
</template>
<script>
import { defineComponent, reactive } from "vue";
export default defineComponent({
    setup() {
        const state = reactive({
            count: 0
        })
        const click = () => {
            state.count++;
        }
        return {
            state,
            click
        }
    }
});
</script>
