<template>
  <div>
    <h1>Órdenes</h1>
    <button @click="openAddOrderModal">Agregar Orden</button>
    <input type="text" v-model="searchId" placeholder="Buscar por ID" @keyup.enter="fetchOrderById">
    <button @click="fetchOrderById">Buscar</button>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Total Amount</th>
          <th>Total Items</th>
          <th>Status</th>
          <th>Paid</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Detalles</th>
          <th>Cambiar Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.totalAmount }}</td>
          <td>{{ order.totalItems }}</td>
          <td>{{ order.status }}</td>
          <td>{{ order.paid ? 'Yes' : 'No' }}</td>
          <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
          <td>{{ new Date(order.updatedAt).toLocaleDateString() }}</td>
          <td>
            <button @click="fetchOrderDetails(order.id)">Ver Detalles</button>
          </td>
          <td>
            <select v-model="order.status" @change="changeOrderStatus(order)">
              <option value="PENDING">Pendiente</option>
              <option value="DELIVERED">Entregado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button @click="fetchOrders(currentPage - 1)" :disabled="currentPage <= 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ lastPage }}</span>
      <button @click="fetchOrders(currentPage + 1)" :disabled="currentPage >= lastPage">Siguiente</button>
    </div>

    <!-- Modal para agregar orden -->
    <div v-if="showAddOrderModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddOrderModal">&times;</span>
        <h2>Agregar Orden</h2>
        <form @submit.prevent="submitAddOrder">
          <div v-for="(item, index) in newOrder.items" :key="index" class="order-item">
            <label for="productId">Product ID:</label>
            <input type="number" v-model="item.productId" required>
            <label for="quantity">Quantity:</label>
            <input type="number" v-model="item.quantity" required>
            <label for="price">Price:</label>
            <input type="number" v-model="item.price" required>
            <button type="button" @click="removeItem(index)">Eliminar Item</button>
          </div>
          <button type="button" @click="addItem">Agregar Item</button>
          <button type="submit">Agregar Orden</button>
        </form>
      </div>
    </div>

    <!-- Modal para mostrar detalles de la orden -->
    <div v-if="showOrderDetailsModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeOrderDetailsModal">&times;</span>
        <h2>Detalles de la Orden</h2>
        <div v-for="(item, index) in orderDetails.OrderItem" :key="index">
          <p>Producto ID: {{ item.productId }}</p>
          <p>Nombre: {{ item.name }}</p>
          <p>Precio: {{ item.price }}</p>
          <p>Cantidad: {{ item.quantity }}</p>
        </div>
        <p>Total Amount: {{ orderDetails.totalAmount }}</p>
        <p>Total Items: {{ orderDetails.totalItems }}</p>
        <p>Status: {{ orderDetails.status }}</p>
        <p>Paid: {{ orderDetails.paid ? 'Yes' : 'No' }}</p>
        <p>Created At: {{ new Date(orderDetails.createdAt).toLocaleDateString() }}</p>
        <p>Updated At: {{ new Date(orderDetails.updatedAt).toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      currentPage: 1,
      lastPage: 1,
      showAddOrderModal: false,
      showOrderDetailsModal: false,
      orderDetails: {},
      searchId: '',
      newOrder: {
        items: [
          {
            productId: '',
            quantity: '',
            price: ''
          }
        ]
      }
    };
  },
  methods: {
    fetchOrders(page = 1) {
      axios.get(`http://localhost:3000/api/orders?page=${page}`)
        .then(response => {
          this.orders = response.data.data;
          this.currentPage = response.data.meta.page;
          this.lastPage = response.data.meta.lastPage;
        })
        .catch(error => {
          console.error('Error fetching the orders:', error);
        });
    },
    fetchOrderById() {
      if (!this.searchId) return;
      axios.get(`http://localhost:3000/api/orders/id/${this.searchId}`)
        .then(response => {
          this.orderDetails = response.data;
          this.showOrderDetailsModal = true;
        })
        .catch(error => {
          console.error('Error fetching the order:', error);
          alert('Orden no encontrada.');
        });
    },
    fetchOrderDetails(orderId) {
      axios.get(`http://localhost:3000/api/orders/id/${orderId}`)
        .then(response => {
          this.orderDetails = response.data;
          this.showOrderDetailsModal = true;
        })
        .catch(error => {
          console.error('Error fetching order details:', error);
        });
    },
    changeOrderStatus(order) {
      axios.patch(`http://localhost:3000/api/orders/id/${order.id}`, { status: order.status })
        .then(response => {
          console.log('Estado actualizado', response.data);
        })
        .catch(error => {
          console.error('Error updating order status:', error);
        });
    },
    openAddOrderModal() {
      this.showAddOrderModal = true;
    },
    closeAddOrderModal() {
      this.showAddOrderModal = false;
    },
    closeOrderDetailsModal() {
      this.showOrderDetailsModal = false;
    },
    addItem() {
      this.newOrder.items.push({
        productId: '',
        quantity: '',
        price: ''
      });
    },
    removeItem(index) {
      this.newOrder.items.splice(index, 1);
    },
    submitAddOrder() {
      axios.post('http://localhost:3000/api/orders', this.newOrder)
        .then(response => {
          alert('Orden agregada');
          this.closeAddOrderModal();
          this.fetchOrders(this.currentPage); // Recargar las órdenes
        })
        .catch(error => {
          console.error('Error adding order:', error);
          alert('Error al agregar la orden: ' + error.message);
        });
    }
  },
  mounted() {
    this.fetchOrders();
  }
}
</script>

<style scoped>
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
  width: 400px;
  position: relative;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.order-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.order-item label {
  margin-top: 5px;
}
</style>
