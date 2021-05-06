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
                N° Historia
              </p>
              <v-text-field
                v-model="profile.clinicHistory"
                placeholder="N° Historia"
                color="black"
                outlined
                dense
                type="number"
                :error-messages="hcErrors"
                :disabled="isEditing"
                @input="$v.profile.clinicHistory.$touch()"
                @blur="$v.profile.clinicHistory.$touch()"
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
                type="decimal"
                :error-messages="weightErrors"
                :disabled="isEditing"
                @input="$v.profile.weight.$touch()"
                @blur="$v.profile.weight.$touch()"
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
                type="decimal"
                :error-messages="heightErrors"
                :disabled="isEditing"
                @input="$v.profile.height.$touch()"
                @blur="$v.profile.height.$touch()"
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
        type="submit"
        @click="isEditing = !isEditing"
      >
        Editar
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, minValue, decimal } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  props: {
    myUid: {
      type: String,
      default: ''
    }
  },
  validations: {
    profile: {
      clinicHistory: { required, minLength: minLength(6), decimal },
      weight: { required, minLength: minLength(2), minValue: minValue(0), decimal },
      height: { required, minLength: minLength(2), minValue: minValue(0), decimal }
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
      uid: this.$props.myUid,
      submitted: false
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
    },
    hcErrors () {
      const errors = []
      if (!this.$v.profile.clinicHistory.$dirty) {
        return errors
      }
      !this.$v.profile.clinicHistory.minLength &&
        errors.push('La historia clínica debe tener al menos 6 números')
      !this.$v.profile.clinicHistory.required &&
        errors.push('La historia clínica es requerida')
      !this.$v.profile.clinicHistory.decimal &&
        errors.push('La historia clínica debe ser un número')
      return errors
    },
    weightErrors () {
      const errors = []
      if (!this.$v.profile.weight.$dirty) {
        return errors
      }
      !this.$v.profile.weight.minValue &&
        errors.push('El peso debe ser mayor a 0')
      !this.$v.profile.weight.required &&
        errors.push('El peso es requerido')
      !this.$v.profile.weight.decimal &&
        errors.push('El peso debe ser un número')
      return errors
    },
    heightErrors () {
      const errors = []
      if (!this.$v.profile.height.$dirty) {
        return errors
      }
      !this.$v.profile.height.minValue &&
        errors.push('La altura debe ser mayor a 0')
      !this.$v.profile.height.required &&
        errors.push('La altura es requerida')
      !this.$v.profile.height.decimal &&
        errors.push('La altura debe ser un número')
      return errors
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
    submit () {
      this.$v.$touch()
    },
    async updatePatientInfo () {
      try {
        if (!this.profile.clinicHistory ||
          !this.profile.weight ||
          !this.profile.height ||
          isNaN(this.profile.clinicHistory) ||
          isNaN(this.profile.weight) ||
          !(this.profile.clinicHistory.length >= 6) ||
          isNaN(this.profile.height)) {
          console.log('No válido')
        } else {
          const { clinicHistory, weight, height } = this.profile
          await this.$fire.firestore.collection('users').doc(this.uid).update({
            clinicHistory,
            weight,
            height
          })
          this.isEditing = true
        }
      } catch (error) {
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    }
  }
}
</script>
