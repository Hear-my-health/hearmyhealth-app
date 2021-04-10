<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="3">
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="dateStarFormatted"
            label="Inicio"
            persistent-hint
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            @blur="dateStart = parseDate(dateStarFormatted)"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="dateStart" no-title @input="menu1 = false" />
      </v-menu>
    </v-col>

    <v-col cols="12" sm="8" md="3">
      <v-menu
        ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="dateEndFormatted"
            label="Fin"
            persistent-hint
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            @blur="dateEnd = parseDate(dateEndFormatted)"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="dateEnd" no-title @input="menu2 = false" />
      </v-menu>
    </v-col>

    <v-col v-if="dataSet.length" cols="12" sm="10" md="10">
      <v-data-table
        :headers="headers"
        :items="dataSet"
        :sort-by="['dataTypeName', 'type']"
        :sort-desc="[true, true]"
        multi-sort
        class="elevation-0"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Fuente de datos </v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
          </v-toolbar>
        </template>

        <template #[`item.dateStart`]="{ item }">
          {{ formatDateTable(item.dateStart) }}
        </template>

        <template #[`item.dateEnd`]="{ item }">
          {{ formatDateTable(item.dateEnd) }}
        </template>

        <template #[`item.heartRate`]="{ item }">
          <div
            v-if="item.heartRate"
            :class="`${item.heartRate.state}`"
            class="py-1 text-center"
          >
            {{ round(item.heartRate.value || 0) }}
          </div>
        </template>

        <template #[`item.calories`]="{ item }">
          <div
            v-if="item.calories"
            :class="`${item.calories.state}`"
            class="py-1 text-center"
          >
            {{ round(item.calories.value || 0) }}
          </div>
        </template>

        <template #[`item.steps`]="{ item }">
          <div
            v-if="item.steps"
            :class="`${item.steps.state}`"
            class="py-1 text-center"
          >
            {{ round(item.steps.value || 0) }}
          </div>
        </template>

        <template #[`item.sleep`]="{ item }">
          <div
            v-if="item.sleep"
            :class="`${item.sleep.state}`"
            class="py-1 text-center"
          >
            {{ round(item.sleep.value || 0) }}
          </div>
        </template>

        <template #[`item.deepSleep`]="{ item }">
          <div
            v-if="item.deepSleep"
            :class="`${item.deepSleep.state}`"
            class="py-1 text-center"
          >
            {{ round(item.deepSleep.value || 0) }}
          </div>
        </template>

        <template #[`item.mood`]="{ item }">
          <div
            v-if="item.mood"
            :class="`${item.mood.state}`"
            class="py-1 text-center"
          >
            {{ round(item.mood.value || 0) }}
          </div>
        </template>

        <template #[`item.fisica`]="{ item }">
          <div
            v-if="item.heartRate && item.calories && item.steps"
            class="text-center"
          >
            {{
              round(
                0.5 * findState(item.heartRate.state).value +
                  0.17 * findState(item.steps.state).value +
                  0.33 * findState(item.calories.state).value
              )
            }}
          </div>
        </template>

        <template #[`item.mental`]="{ item }">
          <div
            v-if="item.sleep && item.deepSleep && item.mood"
            class="text-center"
          >
            {{
              round(
                0.17 * findState(item.sleep.state).value +
                  0.5 * findState(item.mood.state).value +
                  0.33 * findState(item.deepSleep.state).value
              )
            }}
          </div>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            color="black"
            elevation="0"
            outlined
            raised
            :to="`/back/${item.uid}`"
          >
            Ver

            <v-icon small class="mr-2"> mdi-arrow-right </v-icon>
          </v-btn>
        </template>

        <template slot="body.append">
          <tr>
            <th />
            <th rowspan="2">PROMEDIO</th>
            <th class="text-center">
              {{ sumField("heartRate") }}
            </th>
            <th class="text-center">
              {{ sumField("calories") }}
            </th>
            <th class="text-center">
              {{ sumField("steps") }}
            </th>
            <th class="text-center">
              {{ sumField("sleep") }}
            </th>
            <th class="text-center">
              {{ sumField("mood") }}
            </th>
            <th class="text-center">
              {{ sumField("deepSleep") }}
            </th>
            <th class="text-center">
              {{ sumFisica() }}
            </th>
            <th class="text-center">
              {{ sumMental() }}
            </th>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],

  props: {
    myUid: {
      type: String,
      default: "",
    },
  },

  validations: {
    dni: { required, minLength: minLength(8), maxLength: maxLength(8) },
    dateOfBirth: { required },
  },

  data() {
    return {
      uid: this.$props.myUid,
      dateStart: "",
      dateStarFormatted: "",
      dateEnd: "",
      dateEndFormatted: "",
      menu1: false,
      menu2: false,
      noData: false,
      dni: "",
      dateOfBirth: "",
      info: {
        dni: "",
        dateOfBirth: "",
      },
      headers: [
        {
          text: "Fecha Inicio",
          align: "start",
          sortable: false,
          value: "dateStart",
        },
        {
          text: "Fecha Fin",
          align: "start",
          sortable: false,
          value: "dateEnd",
        },
        {
          text: "Frecuencia cardiaca",
          align: "start",
          sortable: true,
          value: "heartRate",
        },
        {
          text: "Calorias",
          align: "start",
          sortable: true,
          value: "calories",
        },
        {
          text: "Pasos",
          align: "start",
          sortable: true,
          value: "steps",
        },
        {
          text: "Sueño",
          align: "start",
          sortable: true,
          value: "sleep",
        },
        {
          text: "Sueño profundo",
          align: "start",
          sortable: true,
          value: "deepSleep",
        },
        {
          text: "Estado de animo",
          align: "start",
          sortable: true,
          value: "mood",
        },
        {
          text: "Salud física",
          align: "start",
          sortable: true,
          value: "fisica",
        },
        {
          text: "Salud mental",
          align: "start",
          sortable: true,
          value: "mental",
        },
      ],
      start: 0,
      end: 0,
    };
  },

  computed: {
    auth() {
      return this.$store.state.authUser || null;
    },

    user() {
      return this.$store.state.user;
    },

    dniErrors() {
      const errors = [];
      if (!this.$v.dni.$dirty) {
        return errors;
      }
      (!this.$v.dni.maxLength || !this.$v.dni.minLength) &&
        errors.push("El DNI debe tener 8 caracteres");
      /* !this.$v.dni.minLength && errors.push("El DNI debe tener 8 caracteres");  */
      !this.$v.dni.required && errors.push("El DNI es requerido");
      return errors;
    },

    dateOfBirthErrors() {
      const errors = [];
      if (!this.$v.dateOfBirth.$dirty) {
        return errors;
      }
      !this.$v.dateOfBirth.required &&
        errors.push("La fecha de nacimiento es requerida");
      return errors;
    },

    dataSetSleep() {
      return this.$store.state.dataSet.filter(
        (s) => s.dataTypeName === "com.google.sleep.segment"
      );
    },

    dataSet() {
      const tt = [];
      const dateStartTime = new Date(this.dateStart).getTime();
      const dateEndTime = new Date(this.dateEnd).getTime();
      const dd = (dateEndTime - dateStartTime) / 86400000;
      let start = dateStartTime;

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000;
          const dd = this.$store.state.dataSet.filter(
            (s) => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          );
          const ee = {
            dateStart: start,
            dateEnd,
            heartRate: dd.find(
              (t) => t.dataTypeName === "com.google.heart_rate.bpm"
            ),
            calories: dd.find(
              (t) => t.dataTypeName === "com.google.calories.expended"
            ),
            steps: dd.find(
              (t) => t.dataTypeName === "com.google.step_count.delta"
            ),
            sleep: dd.find(
              (t) => t.dataTypeName === "com.google.sleep.segment"
            ),
            deepSleep: dd.find(
              (t) => t.dataTypeName === "app.web.hear-my-health.sleep.deep"
            ),
            mood: this.overageValueDataSet(dd),
          };

          start = dateEnd;
          tt.push(ee);
        }
      }
      console.log(tt);
      return tt;
    },
  },

  watch: {
    dateStart(val) {
      this.dateStarFormatted = this.formatDate(this.dateStart);
    },
    dateEnd(val) {
      this.dateEndFormatted = this.formatDate(this.dateEnd);
    },
    user() {
      if (!this.user.dni || !this.user.dateOfBirth) {
        this.noData = true;
      } else {
        this.noData = false;
      }
    },
  },
  created() {
    const date = new Date();
    this.dateEnd = date.toISOString().substr(0, 10);
    this.dateEndFormatted = this.formatDate(date.toISOString().substr(0, 10));

    date.setDate(date.getDate() - 7);
    this.dateStart = date.toISOString().substr(0, 10);
    this.dateStarFormatted = this.formatDate(date.toISOString().substr(0, 10));
  },

  mounted() {
    const { authUser } = this.$store.state;
    if (!authUser) {
      this.$router.push("/");
    } else {
      /* this.$store.dispatch("getDataSet", { uid: authUser.uid }); */
      this.$store.dispatch("getDataSet", { uid: this.uid });
      this.$store.dispatch("getUser", { uid: authUser.uid });
    }
  },

  methods: {
    findState(key) {
      if (key) {
        const state = [
          {
            key: "green",
            value: 1,
            percentaje: 100,
          },
          {
            key: "yellow",
            value: 0.5,
            percentaje: 100,
          },
          {
            key: "red",
            value: 0,
            percentaje: 100,
          },
          {
            key: "not",
            value: 0,
            percentaje: 100,
          },
        ];
        return state.find((e) => e.key === key);
      }

      return {
        key: "not",
        value: 0,
        percentaje: 100,
      };
    },

    sumField(key) {
      if (this.dataSet.length) {
        const dataSetByKey = this.dataSet.filter((e) => e[key]);
        if (dataSetByKey.length) {
          const initialValue = 0;
          const average =
            dataSetByKey.reduce(function (total, currentValue) {
              return total + currentValue[key].value || 0;
            }, initialValue) / dataSetByKey.length;
          return this.round(average);
        }
        return 0;
      }
      return 0;
    },

    sumFisica() {
      const states = [
        {
          key: "green",
          value: 1,
          percentaje: 100,
        },
        {
          key: "yellow",
          value: 0.5,
          percentaje: 100,
        },
        {
          key: "red",
          value: 0,
          percentaje: 100,
        },
        {
          key: "not",
          value: 0,
          percentaje: 100,
        },
      ];
      if (this.dataSet.length) {
        const dataSetByKey = this.dataSet.filter((e) => e.heartRate);
        if (dataSetByKey.length) {
          const initialValue = 0;
          const average =
            dataSetByKey.reduce(function (total, item) {
              const heartRateValue =
                0.5 *
                states.find((e) => e.key === item.heartRate.state || "not")
                  .value;
              const stepsValue =
                0.17 *
                states.find((e) => e.key === item.steps.state || "not").value;
              const caloriesValue =
                0.33 *
                states.find((e) => e.key === item.calories.state || "not")
                  .value;

              return total + (heartRateValue + stepsValue + caloriesValue) || 0;
            }, initialValue) / dataSetByKey.length;

          return this.round(average);
        }
        return 0;
      }
      return 0;
    },

    sumMental() {
      const states = [
        {
          key: "green",
          value: 1,
          percentaje: 100,
        },
        {
          key: "yellow",
          value: 0.5,
          percentaje: 100,
        },
        {
          key: "red",
          value: 0,
          percentaje: 100,
        },
        {
          key: "not",
          value: 0,
          percentaje: 100,
        },
      ];
      if (this.dataSet.length) {
        const dataSetByKey = this.dataSet.filter((e) => e.sleep);
        if (dataSetByKey.length) {
          const initialValue = 0;
          const average =
            dataSetByKey.reduce(function (total, item) {
              const sleepValue =
                0.17 *
                states.find((e) =>
                  e.key === item.sleep ? item.sleep.state : "not"
                ).value;
              const moodValue =
                0.5 *
                states.find((e) =>
                  e.key === item.mood ? item.mood.state : "not"
                ).value;
              const deepSleepValue =
                0.33 *
                states.find((e) =>
                  e.key === item.deepSleep ? item.deepSleep.state : "not"
                ).value;

              return total + (sleepValue + moodValue + deepSleepValue) || 0;
            }, initialValue) / dataSetByKey.length;

          return this.round(average);
        }
        return 0;
      }
      return 0;
    },

    overageValueDataSet(dd) {
      const valueFilter = dd.filter(
        (t) => t.dataTypeName === "app.web.hear-my-health.mood.segment"
      );
      const initialValue = 0;
      const average =
        valueFilter.reduce(function (total, currentValue) {
          return total + currentValue.value || 0;
        }, initialValue) / valueFilter.length;
      if (average) {
        return { ...dd[0], value: average };
      }
      return valueFilter[0];
      /* return dd[0]; */
    },

    submit() {
      this.$v.$touch();
    },
    async updateInfo() {
      try {
        const { uid } = this.auth;
        const { dni, dateOfBirth } = this;
        await this.$fire.firestore.collection("users").doc(uid).update({
          dni,
          dateOfBirth,
        });
        this.noData = false;
      } catch (error) {
        this.$store.dispatch("SET_MESSAGE", { message: error });
      }
    },

    round(num) {
      return Math.round(num * 100) / 100;
    },

    formatDateTable(item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10);
      return ss;
    },

    formatDate(date) {
      if (!date) {
        return null;
      }

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) {
        return null;
      }

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    nameData(scope) {
      switch (scope) {
        case "com.google.heart_rate.bpm":
          return "Ritmo cardiaco";
        case "com.google.step_count.cadence":
          return "Cadencia de conteo de pasos";
        case "com.google.step_count.delta":
          return "Delta de recuento de pasos";
        case "com.google.calories.expended":
          return "Calorías quemadas";
        case "com.google.sleep.segment":
          return "Sueño";
        case "app.web.hear-my-health.sleep.deep":
          return "Sueño profundo";
        case "app.web.hear-my-health.mood.segment":
          return "Estado de animo";
        default:
          return "desconocido";
      }
    },
  },
};
</script>
