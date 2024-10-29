  <template>
    <div class="card mx-auto mt-5" style="width: 350px;">
      <form 
        @submit.prevent="procesarFormulario"
        class="card-body">
        <h1>{{ tarea ? 'Editar':'Agregar' }} Tarea</h1>
        <input 
          class="form-control mb-2"
          type="text" 
          v-model="formData.name"
          placeholder="name"
          required>
        <input 
          type="text"
          placeholder="price"
          v-model="formData.price"
          class="form-control mb-3"
          required
          >
        <button :disabled="cargando" class="btn btn-primary w-100">Guardar</button>
      </form>
    </div>
  </template>

  <script setup lang="ts">
  import {computed, onMounted, reactive, ref, watch} from "vue";
  import {API, ITarea} from "@/contantes";
  import {useRouter} from "vue-router";

  const props = defineProps({
    tarea:{
      type: Object as ()=> ITarea | null,
      default: null
    }
  })
  const formData = reactive({
    name: '',
    price: ''
  })
  const cargando = ref(false)
  const router = useRouter()
  const tarea = computed(()=> props.tarea)

  watch(tarea, ()=>{
    formData.name = tarea.value.name
    formData.price = tarea.value.price
  })

  const procesarFormulario = async()=>{
    cargando.value = true;
    if(tarea.value){
      await fetch(`${API}${tarea.value.id}`,{
        method: 'PATCH',
        body: JSON.stringify({name:formData.name, price: formData.price}),
        headers:{
          'Content-Type': 'application/json'
        }
      })
    }else{
      await fetch(`${API}`,{
        method: 'POST',
        body: JSON.stringify({name:formData.name, price: formData.price}),
        headers:{
          'Content-Type': 'application/json'
        }
      })
    }
    cargando.value = false;
    router.back()
  }
  </script>

  <style scoped>

  </style>