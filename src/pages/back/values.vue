<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="10">
        <v-data-table
          :headers="headers"
          :items="values"
          :sort-by="['email', 'name']"
          :sort-desc="[false, true]"
          multi-sort
          class="elevation-0"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Rangos para indicadores</v-toolbar-title>
              <v-divider class="mx-4" inset vertical />
              <v-spacer />
            </v-toolbar>
          </template>

          <template #[`item.actions`]="{ item }">
            <v-btn
              color="black"
              elevation="0"
              outlined
              raised
              @click="updateValue(item)"
            >
              Editar
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px" elevation="0">
      <form @submit.prevent="createValue">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.key"
                    outlined
                    :counter="10"
                    label="key"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.name"
                    outlined
                    :counter="20"
                    label="Nombre"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.indicator"
                    outlined
                    :counter="10"
                    label="Indicador"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.indicatorUnit"
                    outlined
                    :counter="10"
                    label="Unidad Indicador"
                    required
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="form.dataTypeName"
                    outlined
                    name="input-7-4"
                    label="Tipo dato"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.type"
                    outlined
                    name="input-7-4"
                    label="Tipo"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.frequency"
                    outlined
                    name="input-7-4"
                    label="Frecuencia"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.maxSalud"
                    outlined
                    name="input-7-4"
                    label="Máximo saludable"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.minSalud"
                    outlined
                    name="input-7-4"
                    label="Mínimo saludable"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.maxAcept"
                    outlined
                    name="input-7-4"
                    label="Máximo aceptable"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.minAcept"
                    outlined
                    name="input-7-4"
                    label="Mínimo aceptable"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.weight"
                    outlined
                    name="input-7-4"
                    label="Pensamiento"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.weightPercentage"
                    outlined
                    name="input-7-4"
                    label="Pensamiento"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn elevation="0" raised @click="dialog = !dialog">
              Cancelar
            </v-btn>

            <v-btn elevation="0" outlined raised type="submit">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </div>
</template>
<script>
export default {
  layout: 'back',

  data () {
    return {
      dialog: false,
      formTitle: 'Agregar Valor',
      form: {
        key: '',
        name: '',
        indicator: '',
        indicatorUnit: '',
        dataTypeName: '',
        type: '',
        frequency: '',
        maxSalud: 0,
        minSalud: 0,
        maxAcept: 0,
        minAcept: 0,
        weight: 0,
        weightPercentage: 0
      },
      headers: [
        // {
        //   text: 'Key',
        //   align: 'start',
        //   sortable: false,
        //   value: 'key'
        // },
        {
          text: 'Indicador',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        // {
        //   text: 'Indicador',
        //   align: 'start',
        //   sortable: false,
        //   value: 'indicator'
        // },
        // {
        //   text: 'Unidad Indicador',
        //   align: 'start',
        //   sortable: false,
        //   value: 'indicatorUnit'
        // },
        // {
        //   text: 'Tipo dato',
        //   align: 'start',
        //   sortable: false,
        //   value: 'dataTypeName'
        // },
        // {
        //   text: 'Tipo',
        //   align: 'start',
        //   sortable: false,
        //   value: 'type'
        // },
        // {
        //   text: 'Frecuencia',
        //   align: 'start',
        //   sortable: false,
        //   value: 'frequency'
        // },
        {
          text: 'Max',
          align: 'start',
          sortable: false,
          value: 'maxSalud'
        },
        {
          text: 'Min',
          align: 'start',
          sortable: false,
          value: 'minSalud'
        },
        {
          text: 'Max Acept',
          align: 'start',
          sortable: false,
          value: 'maxAcept'
        },
        {
          text: 'Min Acept',
          align: 'start',
          sortable: false,
          value: 'minAcept'
        },
        // {
        //   text: 'Peso',
        //   align: 'start',
        //   sortable: false,
        //   value: 'weight'
        // },
        // {
        //   text: 'Porcentaje Peso',
        //   align: 'start',
        //   sortable: false,
        //   value: 'weightPercentage'
        // },
        { text: 'Acciones', value: 'actions' }
      ]
    }
  },

  async fetch ({ store }) {
    try {
      await store.dispatch('getValues')
    } catch (e) {
      return 'error'
    }
  },

  computed: {
    values () {
      return this.$store.state.values
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getValues')
    }
  },

  methods: {
    close () {
      this.dialog = !this.dialog
    },

    updateValue (item) {
      const rr = { ...item, id: item.id }
      this.form = JSON.parse(JSON.stringify(rr))
      this.close()
      this.edit = true
    },

    async createValue () {
      try {
        if (this.edit) {
          await this.$fire.firestore
            .collection('values')
            .doc(this.form.id)
            .set({
              ...this.form
            })
        } else {
          await this.$fire.firestore
            .collection('values')
            .doc()
            .set({
              ...this.form
            })
        }

        this.close()
      } catch (error) {
        return error
      }
    }
  }
}
</script>
