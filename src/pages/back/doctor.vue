<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-col cols="12" sm="6" md="6">
        <h4 class="text-h4 mb-4 font-weight-medium">
          Doctor
        </h4>
        <form @submit.prevent="createDoctor">
          <div>
            <p class="mb-1">
              Correo
            </p>
            <v-text-field
              v-model="form.email"
              placeholder="Correo"
              :rules="emailRules"
              outlined
              color="black"
              dense
              type="email"
            />
          </div>
          <div class="mb-3">
            <p class="mb-1">
              Contraseña
            </p>
            <v-text-field
              v-model="form.password"
              placeholder="Contraseña"
              :rules="passwordRules"
              color="black"
              outlined
              dense
              type="password"
            />
          </div>
          <v-btn
            elevation="0"
            outlined
            raised
            block
            type="submit"
          >
            Crear doctor
          </v-btn>
        </form>
      </v-col>
      <div>
        users {{ users }}
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'dashboard',

  data () {
    return {
      form: {
        email: '',
        password: ''
      },

      passwordRules: [
        v => !!v || 'Password is required'
      ],

      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }
  },

  async fetch ({ store }) {
    try {
      await store.dispatch('getUsers')
    } catch (e) {
      return 'error'
    }
  },

  computed: {
    users () {
      return this.$store.state.users
    }
  },

  mounted () {
    this.$store.dispatch('getUsers')
  },

  methods: {
    async createDoctor () {
      try {
        const { email, password } = this.form
        await this.$fireModule
          .auth()
          .createUserWithEmailAndPassword(email, password)
      } catch (error) {
        console.log('error', error)
      }
    },

    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>
