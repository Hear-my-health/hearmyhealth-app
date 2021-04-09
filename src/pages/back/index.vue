<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="10">
      <v-data-table
        :headers="headers"
        :items="users"
        :sort-by="['email', 'name']"
        :sort-desc="[false, true]"
        multi-sort
        class="elevation-0"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Pacientes</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
          </v-toolbar>
        </template>
        <template #[`item.picture`]="{ item }">
          <v-avatar size="36">
            <img :src="item.picture" alt="John">
          </v-avatar>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            color="black"
            elevation="0"
            outlined
            raised
            :to="`/back/${item.uid}#dashboard`"
          >
            Ver

            <v-icon small class="mr-2">
              mdi-arrow-right
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
    <v-dialog
      v-if="
        noData === true && user.role === 'admin' && authUser.uid === user.uid
      "
      v-model="info"
      max-width="500px"
      elevation="0"
    >
      <form @submit.prevent="updateInfo">
        <!-- <form> -->
        <v-card>
          <v-card-title>
            <span class="headline">Actualice sus datos</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="dni"
                    outlined
                    label="DNI"
                    required
                    :error-messages="dniErrors"
                    @input="$v.dni.$touch()"
                    @blur="$v.dni.$touch()"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-select
                    v-model="specialty"
                    outlined
                    :items="specialties"
                    label="Especialidad"
                    :error-messages="specialtyErrors"
                    @input="$v.specialty.$touch()"
                    @blur="$v.specialty.$touch()"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="dateOfBirth"
                    type="date"
                    outlined
                    label="Fecha de nacimiento"
                    required
                    :error-messages="dateOfBirthErrors"
                    @input="$v.dateOfBirth.$touch()"
                    @blur="$v.dateOfBirth.$touch()"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" elevation="0" outlined raised @click="submit">
              Actualizar
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  layout: 'back',
  validations: {
    dni: { required, minLength: minLength(8), maxLength: maxLength(8) },
    specialty: { required, minLength: minLength(3) },
    dateOfBirth: { required }
  },
  data () {
    return {
      noData: false,
      specialties: ['Psicólogo', 'Nutricionista', 'Médico general', 'Otro'],
      dni: '',
      specialty: '',
      dateOfBirth: '',
      info: {
        dni: '',
        specialty: '',
        dateOfBirth: ''
      },
      form: {
        email: '',
        password: ''
      },

      passwordRules: [v => !!v || 'Password is required'],

      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],

      headers: [
        {
          text: 'Imagen',
          align: 'start',
          sortable: false,
          value: 'picture'
        },
        {
          text: 'Email',
          align: 'start',
          sortable: false,
          value: 'email'
        },
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'uid'
        },
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: '', value: 'actions', sortable: false }
      ]
    }
  },

  async fetch ({ store }) {
    try {
      await store.dispatch('getUsers')
    } catch (e) {
      return e
    }
  },

  computed: {
    authUser () {
      return this.$store.state.authUser
    },
    user () {
      return this.$store.state.user
    },
    users () {
      return this.$store.state.users.filter(user => user.role === 'user')
    },
    dniErrors () {
      const errors = []
      if (!this.$v.dni.$dirty) {
        return errors
      }
      (!this.$v.dni.maxLength || !this.$v.dni.minLength) &&
        errors.push('El DNI debe tener 8 caracteres')
      !this.$v.dni.required && errors.push('El DNI es requerido')
      return errors
    },

    specialtyErrors () {
      const errors = []
      if (!this.$v.specialty.$dirty) {
        return errors
      }
      !this.$v.specialty.minLength &&
        errors.push('La especialidad debe tener 5 caracteres como mínimo')
      !this.$v.specialty.required &&
        errors.push('La especialidad es requerida')
      return errors
    },

    dateOfBirthErrors () {
      const errors = []
      if (!this.$v.dateOfBirth.$dirty) {
        return errors
      }
      !this.$v.dateOfBirth.required &&
        errors.push('La fecha de nacimiento es requerida')
      return errors
    }
  },

  watch: {
    user () {
      if (this.user.specialty) {
        localStorage.setItem('doctorSpecialty', this.user.specialty)
      }
      if (!this.user.dni || !this.user.dateOfBirth || !this.user.specialty) {
        this.noData = true
      } else {
        this.noData = false
      }
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getUsers')
      this.$store.dispatch('getUser', { uid: authUser.uid })
    }
  },

  methods: {
    submit () {
      this.$v.$touch()
    },

    async updateInfo () {
      try {
        const { uid } = this.$store.state.authUser
        const { dni, specialty, dateOfBirth } = this
        await this.$fire.firestore.collection('users').doc(uid).update({
          dni,
          specialty,
          dateOfBirth
        })
        this.noData = false
      } catch (error) {
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    },
    async createDoctor () {
      try {
        const { email, password } = this.form
        await this.$fireModule
          .auth()
          .createUserWithEmailAndPassword(email, password)
      } catch (error) {
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    },

    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>
