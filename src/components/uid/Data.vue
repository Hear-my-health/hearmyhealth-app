<template>
  <v-container>
    <v-row class="pl-5" justify="start" align="center">
      Paciente: {{ user.name }}
    </v-row>
    <v-row justify="center" align="center">
      <!-- <v-col cols="12" sm="4" md="4">
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
          <v-date-picker
            v-model="dateStart"
            min="2020-12-01"
            no-title
            @input="menu1 = false"
          />
        </v-menu>
      </v-col>

      <v-col cols="12" sm="4" md="4">
        <v-menu
          ref="menu2"
          v-model="menu2"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
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
          <v-date-picker
            v-model="dateEnd"
            :min="dateStart"
            :max="nowDate"
            no-title
            @input="menu2 = false"
          />
        </v-menu>
      </v-col> -->

      <v-col v-if="dataSet.length">
        <v-data-table
          :headers="headers"
          :items="dataSet"
          :items-per-page="5"
          :sort-by="['dataTypeName', 'type']"
          :sort-desc="[true, true]"
          multi-sort
          class="elevation-0"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Fuente de datos </v-toolbar-title>
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
            <div v-if="item.heartRate">
              <v-row>
                <v-col
                  v-if="!dataTest"
                  class="py-1 text-center"
                  style="height: 80%"
                >
                  {{ item.heartRate.point.value[2].fpVal.toFixed() }}
                </v-col>
                <v-col
                  class="py-1 text-center"
                  :class="`${item.heartRate.state}`"
                  style="height: 80%; margin-right: 5px"
                >
                  {{ item.heartRate.value.toFixed() }}
                </v-col>
                <v-col
                  v-if="!dataTest"
                  class="py-1 text-center"
                  style="height: 80%; margin-right: 5px"
                >
                  {{ item.heartRate.point.value[1].fpVal.toFixed() }}
                </v-col>
              </v-row>
            </div>
            <!--             <div v-if="item.heartRate" class="py-1 text-center">
              <span :class="`${item.heartRate.state}`">{{
                round(item.heartRate.value)
              }}</span>

              <span
                v-if="!dataTest"
                :class="`${
                  round(item.heartRate.point.value[1].fpVal) < 0.4
                    ? `red`
                    : round(item.heartRate.point.value[1].fpVal) > 0.4 &&
                      round(item.heartRate.point.value[1].fpVal) <= 0.7
                    ? `yellow`
                    : `green`
                }`"
              >
                - {{ round(item.heartRate.point.value[1].fpVal) }}
              </span>
              <span
                v-if="!dataTest"
                :class="`${
                  round(item.heartRate.point.value[2].fpVal) < 0.4
                    ? `red`
                    : round(item.heartRate.point.value[2].fpVal) > 0.4 &&
                      round(item.heartRate.point.value[2].fpVal) <= 0.7
                    ? `yellow`
                    : `green`
                }`"
              >
                - {{ round(item.heartRate.point.value[2].fpVal) }}
              </span>
            </div> -->
            <div v-if="!item.heartRate" class="py-1 text-center no-values" />
          </template>

          <template #[`item.calories`]="{ item }">
            <div
              v-if="item.calories"
              :class="`${item.calories.state}`"
              class="py-1 text-center"
            >
              {{ round(item.calories.value) }}
            </div>
            <div v-if="!item.calories" class="py-1 text-center no-values" />
          </template>

          <template #[`item.steps`]="{ item }">
            <div
              v-if="item.steps"
              :class="`${item.steps.state}`"
              class="py-1 text-center"
            >
              {{ round(item.steps.value) }}
            </div>
            <div v-if="!item.steps" class="py-1 text-center no-values" />
          </template>
          <template #[`item.fisica`]="{ item }">
            <div
              v-if="item.heartRate && item.calories && item.steps"
              :class="`${
                round(
                  0.5 * findState(item.heartRate.state).value +
                    0.17 * findState(item.steps.state).value +
                    0.33 * findState(item.calories.state).value
                ) < 0.4
                  ? `red`
                  : round(
                      0.5 * findState(item.heartRate.state).value +
                        0.17 * findState(item.steps.state).value +
                        0.33 * findState(item.calories.state).value
                    ) > 0.4 &&
                    round(
                      0.5 * findState(item.heartRate.state).value +
                        0.17 * findState(item.steps.state).value +
                        0.33 * findState(item.calories.state).value
                    ) <= 0.7
                  ? `yellow`
                  : `green`
              }`"
              class="text-center"
              style="height: 50%; width: 80%"
            />
            <div
              v-if="!item.heartRate && item.calories && item.steps"
              :class="`${
                round(
                  0.17 * findState(item.steps.state).value +
                    0.33 * findState(item.calories.state).value
                ) < 0.4
                  ? `red`
                  : round(
                      0.17 * findState(item.steps.state).value +
                        0.33 * findState(item.calories.state).value
                    ) > 0.4 &&
                    round(
                      0.17 * findState(item.steps.state).value +
                        0.33 * findState(item.calories.state).value
                    ) <= 0.7
                  ? `yellow`
                  : `green`
              }`"
              class="text-center"
              style="height: 50%; width: 80%"
            />
          </template>
          <template #[`item.sleep`]="{ item }">
            <div
              v-if="item.sleep"
              :class="`${item.sleep.state}`"
              class="py-1 text-center"
            >
              {{ round(item.sleep.value) }}
            </div>
            <div v-if="!item.sleep" class="py-1 text-center no-values" />
          </template>

          <template #[`item.deepSleep`]="{ item }">
            <div
              v-if="item.deepSleep"
              :class="`${item.deepSleep.state}`"
              class="py-1 text-center"
            >
              {{ round(item.deepSleep.value) }}
            </div>
            <div v-if="!item.deepSleep" class="py-1 text-center no-values" />
          </template>

          <template #[`item.mood`]="{ item }">
            <div
              v-if="item.mood"
              :class="`${
                item.mood.value < 0.4
                  ? `red`
                  : item.mood.value > 0.4 && item.mood.value <= 0.7
                  ? `yellow`
                  : `green`
              }`"
              class="py-1 text-center"
            >
              {{ round(item.mood.value) }}
            </div>
            <div v-if="!item.mood" class="py-1 text-center no-values" />
          </template>

          <template #[`item.mental`]="{ item }">
            <div
              v-if="item.sleep && item.deepSleep && item.mood"
              class="text-center"
              :class="`${
                round(
                  0.17 * findState(item.sleep.state).value +
                    0.5 * findState(item.mood.state).value +
                    0.33 * findState(item.deepSleep.state).value
                ) <= 0.4
                  ? `red`
                  : round(
                      0.17 * findState(item.sleep.state).value +
                        0.5 * findState(item.mood.state).value +
                        0.33 * findState(item.deepSleep.state).value
                    ) > 0.4 &&
                    round(
                      0.17 * findState(item.sleep.state).value +
                        0.5 * findState(item.mood.state).value +
                        0.33 * findState(item.deepSleep.state).value
                    ) <= 0.7
                  ? `yellow`
                  : `green`
              }`"
              style="height: 50%; width: 80%"
            />
            <div
              v-if="item.sleep && item.deepSleep && !item.mood"
              class="text-center"
              :class="`${
                round(
                  0.17 * findState(item.sleep.state).value +
                    0 +
                    0.33 * findState(item.deepSleep.state).value
                ) <= 0.4
                  ? `red`
                  : round(
                      0.17 * findState(item.sleep.state).value +
                        0 +
                        0.33 * findState(item.deepSleep.state).value
                    ) > 0.4 &&
                    round(
                      0.17 * findState(item.sleep.state).value +
                        0 +
                        0.33 * findState(item.deepSleep.state).value
                    ) <= 0.7
                  ? `yellow`
                  : `green`
              }`"
              style="height: 50%; width: 80%"
            />
            <div
              v-if="!item.sleep && !item.deepSleep && item.mood"
              class="text-center"
              :class="`${
                round(0.5 * findState(item.mood.state).value) <= 0.4
                  ? `red`
                  : round(0.5 * findState(item.mood.state).value) > 0.4 &&
                    round(0.5 * findState(item.mood.state).value) <= 0.7
                  ? `yellow`
                  : `green`
              }`"
              style="height: 50%; width: 80%"
            />
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

          <!-- <template slot="body.append">
            <tr>
              <th />
              <th rowspan="2">
                PROMEDIO
              </th>
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
                {{ sumField("deepSleep") }}
              </th>
              <th class="text-center">
                {{ sumField("mood") }}
              </th>
              <th class="text-center">
                {{ sumFisica() }}
              </th>
              <th class="text-center">
                {{ sumMental() }}
              </th>
            </tr>
          </template> -->
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
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
    dateStart: {
      type: String,
      default: "",
    },
    dateEnd: {
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
      nowDate: new Date().toISOString().slice(0, 10),
      uid: this.$props.myUid,
      /* dateStart: "", */
      dateStart: this.$props.dateStart,
      dateEnd: this.$props.dateEnd,
      dateStarFormatted: "",
      /* dateEnd: "", */
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
      dataTest: true,
      headers: [
        {
          text: "Fecha",
          align: "start",
          sortable: false,
          value: "dateStart",
        },
        // {
        //   text: 'Fecha Fin',
        //   align: 'start',
        //   sortable: false,
        //   value: 'dateEnd'
        // },
        {
          text: "Ritmo cardiaco: Min -  PROM - Max",
          align: "start",
          sortable: false,
          value: "heartRate",
        },
        {
          text: "Calorias",
          align: "start",
          sortable: false,
          value: "calories",
        },
        {
          text: "Pasos",
          align: "start",
          sortable: false,
          value: "steps",
        },
        {
          text: "Salud física",
          align: "start",
          sortable: false,
          value: "fisica",
        },
        {
          text: "Sueño",
          align: "start",
          sortable: false,
          value: "sleep",
        },
        {
          text: "S. profundo",
          align: "start",
          sortable: false,
          value: "deepSleep",
        },
        {
          text: "Estado ánimo",
          align: "start",
          sortable: false,
          value: "mood",
        },
        {
          text: "Salud mental",
          align: "start",
          sortable: false,
          value: "mental",
        },
      ],
      start: 0,
      end: 0,
    };
  },

  /*   async fetch ({ store }) {
    try {
      await store.dispatch('getValues')
    } catch (e) {
      return 'error'
    }
  }, */

  computed: {
    auth() {
      return this.$store.state.authUser || null;
    },

    user() {
      return this.$store.state.user;
    },

    values() {
      return this.$store.state.values.filter(
        (e) => e.indicator === "heartRate"
      );
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
      const end = new Date(this.dateEnd);
      end.setDate(end.getDate() + 1);
      const dateEndTime = end.getTime();
      const dd = (dateEndTime - dateStartTime) / 86400000;

      let start = dateStartTime;

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000;
          const dd = this.$store.state.dataSet.filter(
            (s) => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          );

          if (dd[index] !== undefined) {
            const source = dd[index].dataSourceId ? dd[index].dataSourceId : "";
            console.log("source", source, dd);
            if (source === "app.web.hear-my-health.csv.claudia") {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.dataTest = true;
            } else {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.dataTest = false;
            }
          }

          const ee = {
            dateStart: start,
            dateEnd,
            heartRate: dd.find(
              (t) =>
                t.dataTypeName === "com.google.heart_rate.bpm" &&
                t.value !== null
            ),
            calories: dd.find(
              (t) =>
                t.dataTypeName === "com.google.calories.expended" &&
                t.value !== null
            ),
            steps: dd.find(
              (t) =>
                t.dataTypeName === "com.google.step_count.delta" &&
                t.value !== null
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
    /* dateStart(val) {
      this.dateStarFormatted = this.formatDate(this.dateStart);
    },
    dateEnd(val) {
      this.dateEndFormatted = this.formatDate(this.dateEnd);
    }, */
    user() {
      if (!this.user.dni || !this.user.dateOfBirth) {
        this.noData = true;
      } else {
        this.noData = false;
      }
    },
  },
  /*   created() {
    const date = new Date();
    this.dateEnd = date.toISOString().substr(0, 10);
    this.dateEndFormatted = this.formatDate(date.toISOString().substr(0, 10));

    date.setDate(date.getDate() - 7);
    this.dateStart = date.toISOString().substr(0, 10);
    this.dateStarFormatted = this.formatDate(date.toISOString().substr(0, 10));
  }, */

  mounted() {
    const { authUser } = this.$store.state;
    if (!authUser) {
      this.$router.push("/");
    } else {
      /* this.$store.dispatch("getDataSet", { uid: authUser.uid }); */
      this.$store.dispatch("getDataSet", { uid: this.uid });
      /* this.$store.dispatch("getUser", { uid: authUser.uid }); */
      this.$store.dispatch("getUser", { uid: this.uid });
      this.$store.dispatch("getValues");
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
        const dataSetByKey = this.dataSet.filter(
          (e) => e.heartRate && e.steps && e.calories
        );
        if (dataSetByKey.length) {
          const initialValue = 0;
          const average =
            dataSetByKey.reduce(function (total, item) {
              const heartRateValue = states.find(
                (e) => e.key === (item.heartRate ? item.heartRate.state : "not")
              ).value;
              const stepsValue = states.find(
                (e) => e.key === (item.steps ? item.steps.state : "not")
              ).value;
              const caloriesValue = states.find(
                (e) => e.key === (item.calories ? item.calories.state : "not")
              ).value;
              const value =
                0.5 * heartRateValue + 0.17 * stepsValue + 0.33 * caloriesValue;
              return total + value;
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
        const dataSetByKey = this.dataSet.filter(
          (e) => e.mood && e.sleep && e.deepSleep
        );
        if (dataSetByKey.length) {
          const initialValue = 0;
          const average =
            dataSetByKey.reduce(function (total, item) {
              const sleepValue = states.find(
                (e) =>
                  e.key ===
                  (item.sleep
                    ? item.sleep.state
                      ? item.sleep.state
                      : item.sleep.stateSleep
                    : "not")
              ).value;
              const moodValue = states.find(
                (e) =>
                  e.key ===
                  (item.mood
                    ? item.mood.state
                      ? item.mood.state
                      : item.mood.stateSleep
                    : "not")
              ).value;
              const deepSleepValue = states.find(
                (e) =>
                  e.key ===
                  (item.deepSleep
                    ? item.deepSleep.state
                      ? item.deepSleep.state
                      : item.deepSleep.stateSleepDeep
                    : "not")
              ).value;
              const value =
                0.5 * moodValue + 0.17 * sleepValue + 0.33 * deepSleepValue;

              return total + value;
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
      if (valueFilter.length) {
        const initialValue = 0;
        const average =
          valueFilter.reduce(function (total, currentValue) {
            return total + currentValue.value || 0;
          }, initialValue) / valueFilter.length;
        if (average) {
          return { ...valueFilter[0], value: average };
        } else {
          return null;
        }
      } else {
        return null;
      }
    },

    checkHeartRateState(value) {
      console.log("value", value);
      if (value && this.values.length !== 0) {
        if (value >= this.values.minSalud && value <= this.values.maxSalud) {
          return "green";
        }
        if (
          value >= this.values.minAcept &&
          (value < this.values.minSalud || value > this.values.maxSalud) &&
          value <= this.values.maxAcept &&
          value !== 0
        ) {
          return "yellow";
        }
        return "red";
      } else {
        return "not";
      }
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

<style>
.no-values {
  height: 80%;
  width: 100%;
  align-self: center;
  justify-content: center;
  background: grey;
}
</style>
