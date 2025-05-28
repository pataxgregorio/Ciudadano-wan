<template>
  <div>
    <q-page class="flex flex-center div">
      <q-card class="my-card card" style="margin-top: 230px">
        <q-card-section class="form formulario">
          <div class="text-h6 titulo">INICIAR SESIÓN</div>

          <q-input v-model="email" label="Email" class="input" />
          <q-input
            v-model="password"
            type="password"
            label="Clave"
            class="input"
          />

          <q-btn
            label="Ingresar"
            color="primary"
            @click="login"
            class="boton"
          />

          <div v-if="error" class="text-negative">{{ error }}</div>
        </q-card-section>
      </q-card>
      <img src="/images/sialogoletras.png" width="330px" />
    </q-page>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router"; // Importa useRouter

const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref(null);

async function login() {
  error.value = null; // Limpiar mensaje de error anterior

  try {
    const response = await axios.post("http://156.235.91.67:3000/login", {
      email: email.value, // Usa "email"
      password: password.value,
    });

    // Almacena el token en localStorage o un almacén de estado (Pinia, Vuex, etc.)
    localStorage.setItem("token", response.data.token);

    router.push("/dashboard"); // Redirige a una ruta protegida
  } catch (err) {
    if (err.response) {
      error.value = err.response.data.message; // Muestra el mensaje de error del servidor
    } else {
      error.value = "Error al iniciar sesión"; // Mensaje genérico en caso de error desconocido
    }
  }
}
</script>

<style>
.form {
  padding: 1.4rem 5rem 1.4rem 5rem;
}

.input {
  margin-top: 8px;
}

.boton {
  margin-top: 15px;
  width: 100%;
}

.my-card {
  background: rgba(255, 255, 255, 1) !important;
  border-radius: 20px;
  -webkit-box-shadow: 8px 13px 68px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 8px 13px 68px -8px rgba(0, 0, 0, 0.75);
  box-shadow: 8px 13px 68px -8px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: inset 0px 0px 31px -7px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: inset 0px 0px 31px -7px rgba(0, 0, 0, 0.75);
  box-shadow: inset 0px 0px 31px -7px rgba(0, 0, 0, 0.75);
}

.my-card .q-card-section {
  background-color: transparent !important;
}

@media screen and (min-width: 768px) {
  .div {
    display: flex;
    flex-direction: column;
  }

  .card {
    margin-bottom: 150px;
    border-radius: 50px;
    -webkit-box-shadow: 8px 13px 68px -8px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 8px 13px 68px -8px rgba(0, 0, 0, 0.75);
    box-shadow: 8px 13px 68px -8px rgba(0, 0, 0, 0.75);
    -webkit-box-shadow: inset 0px 0px 31px -7px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: inset 0px 0px 31px -7px rgba(0, 0, 0, 0.75);
    box-shadow: inset 0px 0px 31px -7px rgba(0, 0, 0, 0.75);
  }

  .formulario {
    padding: 120px 300px 120px 300px;
    z-index: 1;
  }

  .titulo {
    text-align: center;
    margin-top: 50px;
  }

  .input {
    margin: 20px;
    border: solid 1px;
    width: 300px;
  }

  .boton {
    margin: 0px 0px 0px 90px;
    width: 150px;
  }

  .div img {
    user-select: none;
    position: absolute;
    margin-bottom: 230px;
    z-index: 0;
  }
}
</style>
