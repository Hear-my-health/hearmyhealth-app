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
            <v-toolbar-title>Usuarios</v-toolbar-title>
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
            :to="`/back/${item.uid}#data`"
          >
            Ver

            <v-icon small class="mr-2">
              mdi-arrow-right
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'back',

  data () {
    return {
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
        {
          text: 'Rol',
          align: 'start',
          sortable: false,
          value: 'role'
        },
        { text: 'Acciones', value: 'actions' }
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
      return this.$store.state.users.filter(user => user.role === 'user')
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
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    },

    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>
