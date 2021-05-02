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
        <br>
        <br>
        <div>Explicación de rangos:</div>
        <v-img size="20%" src="https://firebasestorage.googleapis.com/v0/b/hear-my-health.appspot.com/o/RANGOS-FOTOUX.png?alt=media&token=3e3bcfcb-c04a-4912-bef0-fe15509d306b" />
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600px" elevation="0">
      <form @submit.prevent="createValue">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <!-- <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.key"
                    outlined
                    label="key"
                    disabled
                  />
                </v-col> -->
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="name"
                    outlined
                    label="Indicador"
                    disabled
                  />
                </v-col>
                <!-- <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.indicator"
                    outlined
                    label="Indicador"
                    disabled
                  />
                </v-col> -->
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="indicatorUnit"
                    outlined
                    label="Unidad Indicador"
                    disabled
                  />
                </v-col>
                <!-- <v-col cols="12" md="12">
                  <v-text-field
                    v-model="form.dataTypeName"
                    outlined
                    disabled
                    label="Tipo dato"
                  />
                </v-col> -->
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="type"
                    outlined
                    disabled
                    name="input-7-4"
                    label="Tipo"
                  />
                </v-col>
                <!-- <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.frequency"
                    outlined
                    name="input-7-4"
                    label="Frecuencia"
                  />
                </v-col> -->
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="minAcept"
                    type="numeric"
                    outlined
                    name="input-7-4"
                    label="Mín aceptable"
                    :error-messages="minAceptErrors"
                    @input="$v.minAcept.$touch()"
                    @blur="$v.minAcept.$touch()"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="minSalud"
                    type="numeric"
                    outlined
                    name="input-7-4"
                    label="Mín saludable"
                    :error-messages="minSaludErrors"
                    @input="$v.minSalud.$touch()"
                    @blur="$v.minSalud.$touch()"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="maxSalud"
                    type="numeric"
                    outlined
                    name="input-7-4"
                    label="Máx saludable"
                    :error-messages="maxSaludErrors"
                    @input="$v.maxSalud.$touch()"
                    @blur="$v.maxSalud.$touch()"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="maxAcept"
                    type="numeric"
                    outlined
                    name="input-7-4"
                    label="Máx aceptable"
                    :error-messages="maxAceptErrors"
                    @input="$v.maxAcept.$touch()"
                    @blur="$v.maxAcept.$touch()"
                  />
                </v-col>
                <!-- <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.weight"
                    outlined
                    name="input-7-4"
                    label="Peso"
                    disabled
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.weightPercentage"
                    outlined
                    name="input-7-4"
                    label="Porcentaje"
                    disabled
                  />
                </v-col> -->
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn elevation="0" raised @click="dialog = !dialog">
              Cancelar
            </v-btn>

            <v-btn elevation="0" outlined raised type="submit" @click="submit">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  // eslint-disable-next-line no-unused-vars
  minLength,
  decimal,
  // eslint-disable-next-line no-unused-vars
  numeric,
  minValue
} from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  layout: 'back',
  validations: {
    minAcept: { required, decimal, minValue: minValue(0) },
    maxAcept: { required, decimal, minValue: minValue(0) },
    minSalud: { required, decimal, minValue: minValue(0) },
    maxSalud: { required, decimal, minValue: minValue(0) }
  },
  data () {
    return {
      dialog: false,
      formTitle: 'Agregar Valor',
      id: '',
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
      weightPercentage: 0,
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
        {
          text: 'Unidad Indicador',
          align: 'start',
          sortable: false,
          value: 'indicatorUnit'
        },
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
          text: 'Min Aceptable',
          align: 'start',
          sortable: false,
          value: 'minAcept'
        },
        {
          text: 'Min Saludable',
          align: 'start',
          sortable: false,
          value: 'minSalud'
        },
        {
          text: 'Max Saludable',
          align: 'start',
          sortable: false,
          value: 'maxSalud'
        },
        {
          text: 'Max Aceptable',
          align: 'start',
          sortable: false,
          value: 'maxAcept'
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
      return this.$store.state.values.filter(e => e.indicator !== 'mood')
    },
    minAceptErrors () {
      const errors = []
      if (!this.$v.minAcept.$dirty) {
        return errors
      }
      !this.$v.minAcept.minValue &&
        errors.push('El valor mínimo aceptado debe ser mayor a 0')
      !this.$v.minAcept.required &&
        errors.push('El valor mínimo aceptado es requerido')
      !this.$v.minAcept.decimal &&
        errors.push('El valor mínimo aceptado debe ser un número')
      return errors
    },
    maxAceptErrors () {
      const errors = []
      if (!this.$v.maxAcept.$dirty) {
        return errors
      }
      !this.$v.maxAcept.minValue &&
        errors.push('El valor máximo aceptado debe ser mayor a 0')
      !this.$v.maxAcept.required &&
        errors.push('El valor máximo aceptado es requerido')
      !this.$v.maxAcept.decimal &&
        errors.push('El valor máximo aceptado debe ser un número')
      return errors
    },
    minSaludErrors () {
      const errors = []
      if (!this.$v.minSalud.$dirty) {
        return errors
      }
      !this.$v.minSalud.minValue &&
        errors.push('El valor mínimo saludable debe ser mayor a 0')
      !this.$v.minSalud.required &&
        errors.push('El valor mínimo saludable es requerido')
      !this.$v.minSalud.decimal &&
        errors.push('El valor mínimo saludable debe ser un número')
      return errors
    },
    maxSaludErrors () {
      const errors = []
      if (!this.$v.maxSalud.$dirty) {
        return errors
      }
      !this.$v.maxSalud.minValue &&
        errors.push('El valor máximo saludable debe ser  mayor a 0')
      !this.$v.maxSalud.required &&
        errors.push('El valor máximo saludable es requerido')
      !this.$v.maxSalud.decimal &&
        errors.push('El valor máximo saludable debe ser un número')
      return errors
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
    submit () {
      this.$v.$touch()
    },
    close () {
      this.dialog = !this.dialog
    },

    updateValue (item) {
      const rr = { ...item, id: item.id }
      this.form = JSON.parse(JSON.stringify(rr))
      this.id = JSON.parse(JSON.stringify(rr.id))
      this.key = JSON.parse(JSON.stringify(rr.key))
      this.name = JSON.parse(JSON.stringify(rr.name))
      this.indicator = JSON.parse(JSON.stringify(rr.indicator))
      this.indicatorUnit = JSON.parse(JSON.stringify(rr.indicatorUnit))
      this.dataTypeName = JSON.parse(JSON.stringify(rr.dataTypeName))
      this.type = JSON.parse(JSON.stringify(rr.type))
      this.frequency = JSON.parse(JSON.stringify(rr.frequency))
      this.minAcept = JSON.parse(JSON.stringify(rr.minAcept))
      this.maxAcept = JSON.parse(JSON.stringify(rr.maxAcept))
      this.minSalud = JSON.parse(JSON.stringify(rr.minSalud))
      this.maxSalud = JSON.parse(JSON.stringify(rr.maxSalud))
      this.weight = JSON.parse(JSON.stringify(rr.weight))
      this.weightPercentage = JSON.parse(JSON.stringify(rr.weightPercentage))
      this.close()
      this.edit = true
    },

    async createValue () {
      try {
        if (
          !this.minAcept ||
          !this.minSalud ||
          !this.maxAcept ||
          !this.maxSalud ||
          isNaN(this.minAcept) ||
          isNaN(this.minSalud) ||
          isNaN(this.maxAcept) ||
          isNaN(this.maxSalud)
        ) {
          console.log('No válido')
        } else {
          console.log('Válido')
          if (this.edit) {
            await this.$fire.firestore.collection('values').doc(this.id).set({
              key: this.key,
              name: this.name,
              indicator: this.indicator,
              indicatorUnit: this.indicatorUnit,
              dataTypeName: this.dataTypeName,
              type: this.type,
              frequency: this.frequency,
              maxSalud: this.maxSalud,
              minSalud: this.minSalud,
              maxAcept: this.maxAcept,
              minAcept: this.minAcept,
              weight: this.weight,
              weightPercentage: this.weightPercentage
            })
            this.close()
          } else {
            await this.$fire.firestore.collection('values').doc().set({
              key: this.key,
              name: this.name,
              indicator: this.indicator,
              indicatorUnit: this.indicatorUnit,
              dataTypeName: this.dataTypeName,
              type: this.type,
              frequency: this.frequency,
              maxSalud: this.maxSalud,
              minSalud: this.minSalud,
              maxAcept: this.maxAcept,
              minAcept: this.minAcept,
              weight: this.weight,
              weightPercentage: this.weightPercentage
            })
          }
        }
      } catch (error) {
        console.log(error)
        return error
      }
    }
  }
}
</script>
