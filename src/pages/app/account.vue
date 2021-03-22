<template>
  <v-row justify="center" align="center">
    <v-col v-if="isClient" cols="12" sm="8" md="6">
      <div v-if="auth">
        <v-avatar color="primary" size="64" class="mt-5 mb-7">
          <v-img :src="auth.photoURL" />
        </v-avatar>
        <div>
          <p class="mb-1">
            UID
          </p>
          <v-text-field
            v-model="auth.uid"
            placeholder="UID"
            color="black"
            outlined
            dense
            type="text"
            disabled
          />
        </div>
        <div>
          <p class="mb-1">
            Nombres
          </p>
          <v-text-field
            v-model="auth.providerData.displayName"
            placeholder="Nombres"
            color="black"
            outlined
            dense
            type="text"
            disabled
          />
        </div>
        <div>
          <p class="mb-1">
            Correo
          </p>
          <v-text-field
            v-model="auth.email"
            placeholder="Correo"
            outlined
            color="black"
            dense
            type="email"
            disabled
          />
        </div>
        <v-btn elevation="0" large outlined raised @click="signOut">
          Cerrar sesión
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: 'dashboard',
  middleware: 'authenticated',

  data () {
    return {
      isClient: false
    }
  },
  computed: {
    auth () {
      return this.$store.state.authUser || null
    }
  },

  mounted () {
    this.isClient = true
  },

  methods: {
    async signOut () {
      try {
        await this.$fireModule.auth().signOut()
        this.$router.push('/')
      } catch (error) {
        console.log('error', error)
      }
    }
  }
}
</script>
