<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="8">
      <h3 class="mb-4">
        Información del paciente
      </h3>
      <form @submit.prevent="updatePatientInfo">
        <div>
          <p class="mb-1">
            Nombres
          </p>
          <v-text-field
            v-model="profile.name"
            placeholder="Nombres"
            value="name"
            color="black"
            outlined
            dense
            type="text"
            disabled
          />
        </div>
        <div>
          <p class="mb-1">
            DNI
          </p>
          <v-text-field
            v-model="profile.dni"
            placeholder="DNI"
            color="black"
            outlined
            dense
            type="text"
            disabled
          />
        </div>
        <div>
          <v-row>
            <v-col>
              <p class="mb-1">
                N° historia clínica
              </p>
              <v-text-field
                v-model="profile.clinicHistory"
                placeholder="N° historia clínica"
                color="black"
                outlined
                dense
                type="number"
                :disabled="isEditing"
              />
            </v-col>
            <v-col>
              <p class="mb-1">
                Peso
              </p>
              <v-text-field
                v-model="profile.weight"
                placeholder="Peso"
                color="black"
                outlined
                dense
                type="number"
                :disabled="isEditing"
              />
            </v-col>
            <v-col>
              <p class="mb-1">
                Altura
              </p>
              <v-text-field
                v-model="profile.height"
                placeholder="Altura"
                color="black"
                outlined
                dense
                type="numeric"
                :disabled="isEditing"
              />
            </v-col>
          </v-row>
        </div>
        <div>
          <v-row>
            <v-col>
              <p class="mb-1">
                Fecha de nacimiento
              </p>
              <v-text-field
                v-model="profile.dateOfBirth"
                placeholder="Edad"
                color="black"
                outlined
                dense
                type="text"
                disabled
              />
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col>
            <v-btn
              v-if="isEditing === false"
              elevation="0"
              large
              outlined
              raised
              type="submit"
            >
              Actualizar
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              v-if="isEditing === false"
              elevation="0"
              large
              outlined
              raised
              @click="isEditing = !isEditing"
            >
              Cancelar
            </v-btn>
          </v-col>
        </v-row>
      </form>
      <v-btn
        v-if="isEditing === true"
        elevation="0"
        large
        outlined
        raised
        @click="isEditing = !isEditing"
      >
        Editar
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    myUid: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      isEditing: true,
      profile: {
        name: '',
        dni: '',
        clinicHistory: '',
        dateOfBirth: '',
        weight: '',
        height: ''
      },
      uid: this.$props.myUid
    }
  },

  async fetch ({ store }) {
    try {
      await store.dispatch('getUser', { uid: this.uid })
    } catch (e) {
      return 'error'
    }
  },

  computed: {
    auth () {
      return this.$store.state.authUser || null
    },
    user () {
      return this.$store.state.user || null
    }
  },

  watch: {
    user () {
      this.profile.name = this.user.name
      this.profile.dni = this.user.dni
      this.profile.clinicHistory = this.user.clinicHistory
      this.profile.dateOfBirth = this.user.dateOfBirth
      this.profile.weight = this.user.weight
      this.profile.height = this.user.height
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getUser', { uid: this.uid })
      if (this.user) {
        this.profile.name = this.user.name
        this.profile.dni = this.user.dni
        this.profile.clinicHistory = this.user.clinicHistory
        this.profile.dateOfBirth = this.user.dateOfBirth
        this.profile.weight = this.user.weight
        this.profile.height = this.user.height
      }
    }
  },

  methods: {
    async updatePatientInfo () {
      try {
        const { clinicHistory, weight, height } = this.profile
        await this.$fire.firestore.collection('users').doc(this.uid).update({
          clinicHistory,
          weight,
          height
        })
        this.isEditing = true
      } catch (error) {
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    }
  }
}
</script>
