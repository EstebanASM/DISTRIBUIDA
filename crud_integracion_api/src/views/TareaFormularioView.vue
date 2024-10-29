<template>
  <div class="container">
    <Formulario
      :product="product"
    />
  </div>
</template>

<script setup lang="ts">
import Formulario from '@/components/Formulario.vue';
import { API, IProduct } from '@/contantes';
import { onBeforeMount, ref } from 'vue';
import {useRoute} from "vue-router";

const {params} = useRoute()
const product = ref<null | IProduct>(null)

onBeforeMount(async()=>{
  if(params.id){
    const data = await fetch(`${API}${params.id}`)
    product.value = await data.json()
  }
})
</script>

<style scoped>

</style>