import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products',
      name: 'products',
      // división de código a nivel de ruta
      // esto genera un chunk separado (Productos.[hash].js) para esta ruta
      // que se carga de forma diferida cuando se visita la ruta.
      component: () => import('../views/TareasView.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      // división de código a nivel de ruta
      // esto genera un chunk separado (Ordenes.[hash].js) para esta ruta
      // que se carga de forma diferida cuando se visita la ruta.
      component: () => import('../views/OrdersView.vue')
    },
    {
      path: '/tarea-formulario',
      name: 'formulario',
      component: () => import('../views/TareaFormularioView.vue')
    }
  ]
})

export default router
