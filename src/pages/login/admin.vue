<template>
  <v-container>
    <v-row justify="center" align="center" class="mt-3">
      <v-col cols="10" sm="8" md="4">
        <v-container v-if="!noAccount">
          <h1>Inicio de sesión - Especialista</h1>
          <form @submit.prevent="signInWithEmailAndPassword">
            <div>
              <p class="mb-1">
                Correo electrónico
              </p>
              <v-text-field
                v-model="acc.email"
                placeholder="Correo electrónico"
                color="black"
                outlined
                dense
                type="email"
              />
            </div>
            <div>
              <p class="mb-1">
                Contraseña
              </p>
              <v-text-field
                v-model="acc.password"
                placeholder="Contraseña"
                color="black"
                outlined
                dense
                type="password"
              />
            </div>
            <p v-if="errors" class="red--text">
              Usuario o contraseña no válido
            </p>
            <v-btn
              elevation="0"
              large
              outlined
              raised
              type="submit"
              :disabled="submitted"
            >
              Iniciar sesión
            </v-btn>
          </form>
        </v-container>
        <v-container v-if="noAccount">
          <h1>Registro de Usuario</h1>
          <form @submit.prevent="createWithEmailAndPassword">
            <div>
              <p class="mb-1">
                Nombres
              </p>
              <v-text-field
                v-model="newDoctor.name"
                placeholder="Nombres"
                color="black"
                outlined
                dense
                type="text"
              />
            </div>
            <div>
              <p class="mb-1">
                Correo electrónico
              </p>
              <v-text-field
                v-model="newDoctor.email"
                placeholder="Correo electrónico"
                color="black"
                outlined
                dense
                type="email"
              />
            </div>
            <div>
              <p class="mb-1">
                Contraseña
              </p>
              <v-text-field
                v-model="newDoctor.password"
                placeholder="Contraseña"
                color="black"
                outlined
                dense
                type="password"
              />
            </div>
            <v-btn
              elevation="0"
              large
              outlined
              raised
              type="submit"
              :disabled="submitted"
            >
              Registrarse
            </v-btn>
          </form>
        </v-container>
        <p v-if="!noAccount">
          Puedes crear un cuenta aquí<span
            style="cursor: pointer"
            class="blue--text"
            @click="noAccount = !noAccount"
          >
            Registrarse</span>
        </p>
        <p v-if="noAccount">
          Inicia sesión aquí<span
            style="cursor: pointer"
            class="blue--text"
            @click="noAccount = !noAccount"
          >
            Iniciar sesión</span>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'free',

  data () {
    return {
      submitted: false,
      errors: false,
      newDoctor: {
        email: '',
        password: ''
      },
      acc: {
        email: '',
        password: ''
      },
      noAccount: false
    }
  },
  methods: {
    createWithEmailAndPassword () {
      this.submitted = true
      const date = new Date().getTime()
      try {
        this.$fire.auth
          .createUserWithEmailAndPassword(
            this.newDoctor.email,
            this.newDoctor.password
          )
          .then((res) => {
            this.$fire.firestore
              .collection('users')
              .doc(res.user.uid)
              .set({
                email: this.newDoctor.email,
                name: this.newDoctor.name,
                createDate: date,
                uid: res.user.uid,
                role: 'admin'
              })
              .then((res) => {
                this.$router.push('/back')
              })
              .catch((err) => {
                this.submitted = false
                this.$store.dispatch('SET_MESSAGE', { message: err })
              })
          })
      } catch (error) {
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    },

    signInWithEmailAndPassword () {
      this.submitted = true
      try {
        this.$fire.auth
          .signInWithEmailAndPassword(this.acc.email, this.acc.password)
          .then((res) => {
            this.$router.push('/back')
          })
          .catch((err) => {
            this.submitted = false
            this.errors = true
            setTimeout(() => (this.errors = false), 5000)
            this.$store.dispatch('SET_MESSAGE', { message: err })
          })
      } catch (error) {
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    }
  }
}
</script>
