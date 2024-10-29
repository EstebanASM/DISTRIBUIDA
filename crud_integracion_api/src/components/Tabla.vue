<template>
  <div>
    <h1>Lista de Productos</h1>
    <input type="number" v-model="searchId" placeholder="Buscar por ID" @keyup.enter="fetchProductById">
    <button @click="fetchProductById">Buscar</button>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Disponible</th>
          <th>Creado</th>
          <th>Actualizado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.available ? 'Sí' : 'No' }}</td>
          <td>{{ new Date(product.createdAt).toLocaleDateString() }}</td>
          <td>{{ new Date(product.updatedAt).toLocaleDateString() }}</td>
          <td>
            <button @click="openEditModal(product)">Editar</button>
            <button @click="deleteProduct(product.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Modal para editar productos -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar Producto</h2>
        <form @submit.prevent="submitEdit">
          <label for="name">Nombre:</label>
          <input type="text" id="name" v-model="editProductData.name">
          <label for="price">Precio:</label>
          <input type="number" id="price" v-model="editProductData.price" step="0.01">
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
    <div>
      <button @click="fetchProducts(currentPage - 1)" :disabled="currentPage <= 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ lastPage }}</span>
      <button @click="fetchProducts(currentPage + 1)" :disabled="currentPage >= lastPage">Siguiente</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      currentPage: 1,
      lastPage: 1,
      total: 0,
      searchId: '',
      showEditModal: false,
      editProductData: {}
    };
  },
  methods: {
    fetchProducts(page = 1) {
      axios.get(`http://localhost:3000/api/products?page=${page}`)
        .then(response => {
          this.products = response.data.data;
          this.currentPage = response.data.meta.page;
          this.lastPage = response.data.meta.lastPage;
          this.total = response.data.meta.total;
        })
        .catch(error => {
          console.error('Error fetching the products:', error);
        });
    },
    fetchProductById() {
      if (!this.searchId) return;
      axios.get(`http://localhost:3000/api/products/${this.searchId}`)
        .then(response => {
          this.products = [response.data]; // Mostrar solo el producto encontrado
        })
        .catch(error => {
          console.error('Error fetching the product:', error);
          alert('Producto no encontrado.');
        });
    },
    deleteProduct(id) {
      if (confirm('¿Estás seguro de querer eliminar este producto?')) {
        axios.delete(`http://localhost:3000/api/products/${id}`)
          .then(() => {
            alert('Producto eliminado');
            this.fetchProducts(this.currentPage); // Recargar los productos
          })
          .catch(error => {
            console.error('Error deleting the product:', error);
          });
      }
    },
    openEditModal(product) {
      this.editProductData = { ...product };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    submitEdit() {
      axios.patch(`http://localhost:3000/api/products/${this.editProductData.id}`, {
        name: this.editProductData.name,
        price: this.editProductData.price
      })
      .then(() => {
        alert('Producto actualizado');
        this.closeEditModal();
        this.fetchProducts(this.currentPage);  // Recargar los productos
      })
      .catch(error => {
        console.error('Error updating the product:', error);
        alert('Error al actualizar el producto: ' + error.message);
      });
    }
  },
  mounted() {
    this.fetchProducts();
  }
}
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
button {
  margin-right: 5px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  position: relative;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
