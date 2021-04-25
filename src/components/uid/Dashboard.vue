<template>
  <v-container>
    <v-row class="pl-5" justify="start" align="center">
      Paciente: {{ user.name }}
    </v-row>
    <v-row>
      <v-col cols="12" sm="9" md="9">
        <v-row justify="center" align="top">
          <v-col cols="12" sm="4" md="4">
            <v-select
              v-model="selectedType"
              :items="selectTypes"
              label="Tipo de Salud"
              outlined
            />
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
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
              <v-date-picker
                v-model="dateEnd"
                no-title
                @input="menu2 = false"
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <!-- SALUD FÍSICA -->
          <v-container v-if="selectedType === 'Salud Física'">
            <v-col
              v-if="dataPhysicalHealth < 30 && dataPhysicalHealth > 0"
              cols="12"
              sm="4"
              md="4"
              justify="center"
              align="center"
            >
              <v-progress-circular
                :rotate="-90"
                :size="100"
                :width="15"
                :value="100"
                color="red"
              >
                {{ "S. Física" }}
              </v-progress-circular>
            </v-col>
            <v-col
              v-if="dataPhysicalHealth < 60 && dataPhysicalHealth >= 30"
              cols="12"
              sm="4"
              md="4"
              justify="center"
              align="center"
            >
              <v-progress-circular
                :rotate="-90"
                :size="100"
                :width="15"
                :value="100"
                color="amber"
              >
                {{ "S. Física" }}
              </v-progress-circular>
            </v-col>
            <v-col
              v-if="dataPhysicalHealth >= 60"
              cols="12"
              sm="12"
              md="4"
              lg="4"
              justify="center"
              align="center"
            >
              <v-progress-circular
                :rotate="-90"
                :size="100"
                :width="15"
                :value="100"
                color="green"
              >
                {{ "S. Física" }}
              </v-progress-circular>
            </v-col>
            <v-col
              v-if="dataStep.length > 0"
              cols="12"
              sm="12"
              md="11"
              lg="11"
              justify="center"
              align="center"
            >
              <bar-chart
                :chart-data="dataStep"
                :options="chartOptions"
                :chart-colors="stepColors"
                label="Pasos"
              />
            </v-col>
          </v-container>
          <!-- FIN SALUD FÍSICA -->
          <!-- SALUD MENTAL -->
          <v-container v-if="selectedType === 'Salud Mental'">
            <v-row>
              <v-col
                v-if="dataMentalHealth < 30 && dataMentalHealth > 0"
                cols="12"
                sm="4"
                md="4"
                justify="center"
                align="center"
              >
                <v-progress-circular
                  :rotate="-90"
                  :size="100"
                  :width="15"
                  :value="100"
                  color="red"
                >
                  {{ "S. Mental" }}
                </v-progress-circular>
              </v-col>
              <v-col
                v-if="dataMentalHealth < 60 && dataMentalHealth >= 30"
                cols="12"
                sm="4"
                md="4"
                justify="center"
                align="center"
              >
                <v-progress-circular
                  :rotate="-90"
                  :size="100"
                  :width="15"
                  :value="100"
                  color="amber"
                >
                  {{ "S. Mental" }}
                </v-progress-circular>
              </v-col>
              <v-col
                v-if="dataMentalHealth >= 60"
                cols="12"
                sm="4"
                md="4"
                justify="center"
                align="center"
              >
                <v-progress-circular
                  :rotate="-90"
                  :size="100"
                  :width="15"
                  :value="100"
                  color="green"
                >
                  {{ "S. Mental" }}
                </v-progress-circular>
              </v-col>
              <v-col cols="12" sm="7" md="7" justify="center" align="center">
                <div>Valores estado de animo:</div>
                <v-img
                  src="https://firebasestorage.googleapis.com/v0/b/hear-my-health.appspot.com/o/caritasExplicacion.png?alt=media&token=caa42dc7-638a-4428-8ae1-5668fe6c4647"
                  max-width="230"
                />
              </v-col>
            </v-row>
            <v-col
              v-if="dataMood.length > 0"
              cols="12"
              sm="11"
              md="11"
              justify="center"
              align="center"
            >
              <bar-chart
                :chart-data="dataMood"
                :options="chartOptions"
                :chart-colors="moodColors"
                label="Estado de ánimo"
              />
            </v-col>
          </v-container>
          <!-- FIN SALUD MENTAL -->
        </v-row>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <div class="fixed-height-container">
          <h4 class="mb-3">
            Recomendaciones
          </h4>
          <v-select
            v-model="selectNotification"
            :item-text="'name'"
            :item-value="'id'"
            :items="notificationItems"
            label="Seleccione tipo"
            dense
            outlined
          />
          <div class="fixed-container">
            <div v-for="(item, index) in dataSetNotification" :key="index">
              <div v-if="item.data.length">
                <div v-for="(idata, idx) in item.data" :key="idx">
                  <v-card class="mb-1 pa-2" elevation="0">
                    <div class="mb-2">
                      <span class="mr-2">
                        <v-icon
                          v-if="idata.state === 'red'"
                          light
                          style="color: red"
                        >
                          mdi-close-circle
                        </v-icon>
                        <v-icon
                          v-if="idata.state === 'yellow'"
                          light
                          style="color: #ffe107"
                        >
                          mdi-alert-circle
                        </v-icon>
                      </span>
                      {{ nameData(idata.dataTypeName) }}
                    </div>
                    <div>
                      <div class="font-weight-light">
                        {{ formatDateTable(item.dateStart) }} -
                        {{ formatDateTable(item.dateEnd) }}
                      </div>
                    </div>
                  </v-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-container v-if="selectedType === 'Salud Física'">
        <v-col
          v-if="
            dataHeartRate.length > 0 && dataHeartRateAvgMinMax.tt2.length === 0
          "
          cols="12"
          sm="12"
          md="12"
          justify="center"
          align="center"
        >
          <line-chart
            :chart-data="dataHeartRate"
            :options="chartOptions"
            :chart-colors="heartRateColors"
            label="Ritmo Cardiaco"
          />
        </v-col>
        <v-col
          v-if="dataHeartRateAvgMinMax.tt2.length > 0"
          cols="12"
          sm="12"
          md="12"
          justify="center"
          align="center"
        >
          <TripleLineChart
            :chartData="dataHeartRateAvgMinMax"
            :options="chartOptions"
            :label="heartRateLabel"
          />
        </v-col>
        <v-col
          v-if="dataCalories.length > 0"
          cols="12"
          sm="12"
          md="12"
          justify="center"
          align="center"
        >
          <line-chart
            :chart-data="dataCalories"
            :options="chartOptions"
            :chart-colors="caloriesColors"
            label="Calorías"
          />
        </v-col>
      </v-container>
      <v-container v-if="selectedType === 'Salud Mental'">
        <v-col
          v-if="dataStep.length > 0"
          cols="12"
          sm="12"
          md="12"
          justify="center"
          align="center"
        >
          <double-bar-chart
            :chart-data="dataSleepDeepSleep"
            :options="chartOptions"
            :label="sleepLabel"
          />
        </v-col>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>

import LineChart from "~/components/uid/charts/LineChart";
import BarChart from "~/components/uid/charts/BarChart";
import DoubleBarChart from "~/components/uid/charts/DoubleBarChart";
import TripleLineChart from "~/components/uid/charts/TripleLineChart";

export default {
  components: {
    LineChart,
    BarChart,
    DoubleBarChart,
    TripleLineChart,

  },

  props: {
    myUid: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      heartRateColors: {
        borderColor: '#E55381',
        pointBorderColor: '#E55381',
        pointBackgroundColor: '#E55381',
        backgroundColor: 'transparent'
      },
      sleepLabel: {
        sleepLabel: 'Sueño',
        deepSleepLabel: 'Sueño profundo'
      },
      heartRateLabel: {
        avgHeartRateLabel: "Ritmo cardíaco",
        maxHeartRateLabel: "Ritmo cardíaco máximo",
        minHeartRateLabel: "Ritmo cardíaco mínimo",
      },
      stepColors: {
        borderColor: '#077187',
        pointBorderColor: '#0E1428',
        pointBackgroundColor: '#AFD6AC',
        backgroundColor: '#74A57F'
      },
      caloriesColors: {
        borderColor: '#0345fc',
        pointBorderColor: '#0345fc',
        pointBackgroundColor: '#0345fc',
        backgroundColor: '#5f7ed4'
      },
      moodColors: {
        borderColor: '#0345fc',
        pointBorderColor: 'transparent',
        pointBackgroundColor: 'transparent',
        backgroundColor: '#5f7ed4'
      },
      dataTest: true,
      uid: this.$props.myUid,
      dateStart: '',
      dateStarFormatted: '',
      dateEnd: '',
      dateEndFormatted: '',
      menu1: false,
      menu2: false,
      start: 0,
      end: 0,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      selectedType: 'Salud Física',
      selectTypes: ['Salud Física', 'Salud Mental'],
      selectItems: [
        'Ritmo cardiaco',
        'Cadencia de conteo de pasos',
        'Delta de recuento de pasos',
        'Calorías quemadas',
        'Sueño',
        'Sueño profundo',
        'Estado de animo'
      ],

      notificationSelectData: 'red',
      notificationItems: [
        {
          id: 'red',
          name: 'Alertas'
        },
        {
          id: 'yellow',
          name: 'Advertencias'
        },
        {
          id: 'all',
          name: 'Todos'
        }
      ],

      selectNameData: 'all',

      selectNames: [
        {
          id: 'all',
          name: 'Todos'
        },
        {
          id: 'com.google.heart_rate.bpm',
          name: 'Ritmo cardiaco'
        },
        {
          id: 'com.google.step_count.delta',
          name: 'Delta de recuento de pasos'
        },
        {
          id: 'com.google.calories.expended',
          name: 'Calorías quemadas'
        },
        {
          id: 'com.google.sleep.segment',
          name: 'Sueño'
        },
        {
          id: 'app.web.hear-my-health.sleep.deep',
          name: 'Sueño profundo'
        },
        {
          id: 'app.web.hear-my-health.mood.segment',
          name: 'Estado de animo'
        }
      ]
    }
  },

  computed: {
    selectNotification: {
      get () {
        return this.notificationSelectData
      },
      set (newValue) {
        this.notificationSelectData = newValue
      }
    },

    selectName: {
      get () {
        return this.selectNameData
      },
      set (newValue) {
        this.selectNameData = newValue
      }
    },

    auth () {
      return this.$store.state.authUser || null
    },

    user () {
      return this.$store.state.user
    },

    dataPhysicalHealth () {
      const avgPhysical = []
      const dateStartTime = new Date(this.dateStart).getTime()
      const end = new Date(this.dateEnd)
      end.setDate(end.getDate() + 1)
      const dateEndTime = end.getTime()
      const dd = (dateEndTime - dateStartTime) / 86400000

      let start = dateStartTime

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000
          const dd = this.$store.state.dataSet.filter(
            s => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          )
          /* const heartRateTemp = dd.filter(
            (s) => s.dataTypeName === "com.google.heart_rate.bpm"
          );
          const stepsTemp = dd.filter(
            (s) => s.dataTypeName === "com.google.step_count.delta"
          );
          const caloriesTemp = dd.filter(
            (s) => s.dataTypeName === "com.google.calories.expended"
          );

          const hr = heartRateTemp.map((e) => {
            return e.value !== null && e.value !== undefined
              ? e.state === "green"
                ? 1
                : e.state === "yellow"
                ? 0.5
                : 0
              : 0;
          });
          const st = stepsTemp.map((e) => {
            return e.value !== null && e.value !== undefined
              ? e.state === "green"
                ? 1
                : e.state === "yellow"
                ? 0.5
                : 0
              : 0;
          });
          const c = caloriesTemp.map((e) => {
            return e.value !== null && e.value !== undefined
              ? e.state === "green"
                ? 1
                : e.state === "yellow"
                ? 0.5
                : 0
              : 0;
          }); */

          const heartRateTemp = dd.find(
            t =>
              t.dataTypeName === 'com.google.heart_rate.bpm' && t.value !== null
          )

          const hr =
            heartRateTemp !== null &&
            heartRateTemp !== undefined &&
            heartRateTemp.value !== null &&
            heartRateTemp.value !== undefined
              ? heartRateTemp.state === 'green'
                ? 1
                : heartRateTemp.state === 'yellow'
                  ? 0.5
                  : 0
              : 0

          const stepsTemp = dd.find(
            t =>
              t.dataTypeName === 'com.google.step_count.delta' &&
              t.value !== null
          )

          const st =
            stepsTemp !== null &&
            stepsTemp !== undefined &&
            stepsTemp.value !== null &&
            stepsTemp.value !== undefined
              ? stepsTemp.state === 'green'
                ? 1
                : stepsTemp.state === 'yellow'
                  ? 0.5
                  : 0
              : 0

          const caloriesTemp = dd.find(
            t =>
              t.dataTypeName === 'com.google.calories.expended' &&
              t.value !== null
          )

          const c =
            caloriesTemp !== null &&
            caloriesTemp !== undefined &&
            caloriesTemp.value !== null &&
            caloriesTemp.value !== undefined
              ? caloriesTemp.state === 'green'
                ? 1
                : caloriesTemp.state === 'yellow'
                  ? 0.5
                  : 0
              : 0

          let avg = 0
          /* for (let x = 0; x < heartRateTemp.length; x++) {
            avg += 0.5 * hr[x] + 0.17 * st[x] + 0.33 * c[x];
            console.log("avg", avg);
          } */
          avg += 0.5 * hr + 0.17 * st + 0.33 * c
          if (avg !== 0) {
            avgPhysical.push(avg)
          }

          start = dateEnd
        }
      }
      console.log('avgphysical', avgPhysical)
      let myAvg = 0
      for (let y = 0; y < avgPhysical.length; y++) {
        if (isNaN(avgPhysical[y])) {
          myAvg += 0
        } else {
          myAvg += avgPhysical[y]
        }
      }
      myAvg = myAvg / avgPhysical.length
      console.log('my avg', myAvg)
      return Math.round(myAvg * 100)
    },

    dataMentalHealth () {
      const avgMental = []
      const dateStartTime = new Date(this.dateStart).getTime()
      const end = new Date(this.dateEnd)
      end.setDate(end.getDate() + 1)
      const dateEndTime = end.getTime()
      const dd = (dateEndTime - dateStartTime) / 86400000
      let start = dateStartTime

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000
          const dd = this.$store.state.dataSet.filter(
            s => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          )
          /* const moodTemp = dd.filter(
            (s) => s.dataTypeName === "app.web.hear-my-health.mood.segment"
          );
          const sleepTemp = dd.filter(
            (s) => s.dataTypeName === "com.google.sleep.segment"
          );
          const deppSleepTemp = dd.filter(
            (s) => s.dataTypeName === "app.web.hear-my-health.sleep.deep"
          );

          const m = moodTemp.map((e) => {
            return e.value !== null || e.value !== undefined
              ? e.state === "green"
                ? 1
                : e.state === "yellow"
                ? 0.5
                : 0
              : 0;
          });
          const sl = sleepTemp.map((e) => {
            return e.value !== null || e.value !== undefined
              ? e.state === "green"
                ? 1
                : e.state === "yellow"
                ? 0.5
                : 0
              : 0;
          });
          const dsl = deppSleepTemp.map((e) => {
            return e.value !== null || e.value !== undefined
              ? e.state === "green"
                ? 1
                : e.state === "yellow"
                ? 0.5
                : 0
              : 0;
          }); */

          const sleepTemp = dd.find(
            t =>
              t.dataTypeName === 'com.google.sleep.segment' && t.value !== null
          )

          const sl =
            sleepTemp !== null &&
            sleepTemp !== undefined &&
            sleepTemp.value !== null &&
            sleepTemp.value !== undefined
              ? sleepTemp.state === 'green'
                ? 1
                : sleepTemp.state === 'yellow'
                  ? 0.5
                  : 0
              : 0

          const deepSleepTemp = dd.find(
            t =>
              t.dataTypeName === 'app.web.hear-my-health.sleep.deep' &&
              t.value !== null
          )

          const dsl =
            deepSleepTemp !== null &&
            deepSleepTemp !== undefined &&
            deepSleepTemp.value !== null &&
            deepSleepTemp.value !== undefined
              ? deepSleepTemp.state === 'green'
                ? 1
                : deepSleepTemp.state === 'yellow'
                  ? 0.5
                  : 0
              : 0

          const moodTemp = this.overageValueDataSet(dd)
          const m =
            moodTemp !== null &&
            moodTemp !== undefined &&
            moodTemp.value !== null &&
            moodTemp.value !== undefined
              ? moodTemp.state === 'green'
                ? 1
                : moodTemp.state === 'yellow'
                  ? 0.5
                  : 0
              : 0

          let avg = 0
          /* for (let x = 0; x < sleepTemp.length; x++) {
            if (m[x]) {
              avg += 0.5 * m[x] + 0.17 * sl[x] + 0.33 * dsl[x];
            } else {
              avg += 0.17 * sl[x] + 0.33 * dsl[x];
            }
          } */
          /*           if (avg !== 0) {
            if (m) {
              avg += 0.5 * m + 0.17 * sl + 0.33 * dsl;
            } else {
              avg += 0.17 * sl + 0.33 * dsl;
            }
          } */
          avg += 0.5 * m + 0.17 * sl + 0.33 * dsl
          if (avg !== 0) {
            avgMental.push(avg)
          }
          start = dateEnd
        }
      }

      console.log('avgMental', avgMental)
      let myAvg = 0
      for (let y = 0; y < avgMental.length; y++) {
        if (isNaN(avgMental[y])) {
          myAvg += 0
        } else {
          myAvg += avgMental[y]
        }
      }
      console.log('myAvg', myAvg)
      myAvg = myAvg / avgMental.length
      return Math.round(myAvg * 100)
    },

    dataCalories () {
      const tt = []
      const dateStartTime = new Date(this.dateStart).getTime()
      const end = new Date(this.dateEnd)
      end.setDate(end.getDate() + 1)
      const dateEndTime = end.getTime()
      const dd = (dateEndTime - dateStartTime) / 86400000
      let start = dateStartTime

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000
          const dd = this.$store.state.dataSet.filter(
            s => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          )
          /* const dataTemp = dd.filter(
            (s) => s.dataTypeName === "com.google.calories.expended"
          ); */
          const dataTemp = dd.find(
            t =>
              t.dataTypeName === 'com.google.calories.expended' &&
              t.value !== null
          )
          const ee = {
            date: this.formatDateTable(start),
            data: dataTemp !== undefined ? Math.round(dataTemp.value) : 0
          }
          tt.push(ee)
          /* dataTemp.forEach((e) => {
            const ee = {
              date: this.formatDateTable(start),
              data: e.value !== null ? Math.round(e.value) : 0,
            };
            tt.push(ee);
          }); */

          start = dateEnd
        }
      }
      return tt
    },
    dataStep () {
      const tt = []
      const dateStartTime = new Date(this.dateStart).getTime()
      const end = new Date(this.dateEnd)
      end.setDate(end.getDate() + 1)
      const dateEndTime = end.getTime()
      const dd = (dateEndTime - dateStartTime) / 86400000
      let start = dateStartTime

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000
          const dd = this.$store.state.dataSet.filter(
            s => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          )
          /* const dataTemp = dd.filter(
            (s) => s.dataTypeName === "com.google.step_count.delta"
          );
          dataTemp.forEach((e) => {
            const ee = {
              date: this.formatDateTable(start),
              data: e.value !== null ? Math.round(e.value) : 0,
            };
            tt.push(ee);
          }); */
          const dataTemp = dd.find(
            t =>
              t.dataTypeName === 'com.google.step_count.delta' &&
              t.value !== null
          )
          const ee = {
            date: this.formatDateTable(start),
            data: dataTemp !== undefined ? Math.round(dataTemp.value) : 0
          }
          tt.push(ee)

          start = dateEnd
        }
      }
      return tt
    },

    dataHeartRate () {
      const tt = []
      const dateStartTime = new Date(this.dateStart).getTime()
      const end = new Date(this.dateEnd)
      end.setDate(end.getDate() + 1)
      const dateEndTime = end.getTime()
      const dd = (dateEndTime - dateStartTime) / 86400000
      let start = dateStartTime

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000
          const dd = this.$store.state.dataSet.filter(
            (s) => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          );
          const dataTemp = dd.find(
            t =>
              t.dataTypeName === 'com.google.heart_rate.bpm' && t.value !== null
          )
          const ee = {
            date: this.formatDateTable(start),
            data: dataTemp !== undefined ? Math.round(dataTemp.value) : 0,
          };
          tt.push(ee);
          start = dateEnd;
        }
      }
      return tt
    },

    dataHeartRateAvgMinMax() {
      const tt = [];
      const tt2 = [];
      const tt3 = [];
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

            if (source !== "app.web.hear-my-health.csv.claudia") {
              const dataTemp = dd.find(
                (t) =>
                  t.dataTypeName === "com.google.heart_rate.bpm" &&
                  t.value !== null
              );
              const ee = {
                date: this.formatDateTable(start),
                data:
                  dataTemp !== undefined
                    ? Math.round(dataTemp.point.value[0].fpVal)
                    : 0,
              };
              const ee1 = {
                date: this.formatDateTable(start),
                data:
                  dataTemp !== undefined
                    ? Math.round(dataTemp.point.value[1].fpVal)
                    : 0,
              };
              const ee2 = {
                date: this.formatDateTable(start),
                data:
                  dataTemp !== undefined
                    ? Math.round(dataTemp.point.value[2].fpVal)
                    : 0,
              };

              tt.push(ee);
              tt2.push(ee1);
              tt3.push(ee2);
            }
          }
          start = dateEnd;
        }
      }
      const toR = {
        tt,
        tt2,
        tt3,
      };
      console.log(toR);
      return toR;
    },

    dataMood() {
      const tt = [];
      const dateStartTime = new Date(this.dateStart).getTime();
      const end = new Date(this.dateEnd);
      end.setDate(end.getDate() + 1);
      const dateEndTime = end.getTime();
      const dd = (dateEndTime - dateStartTime) / 86400000;
      let start = dateStartTime;

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000
          const dd = this.$store.state.dataSet.filter(
            s => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          )
          /* const dataTemp = dd.filter(
            (s) => s.dataTypeName === "app.web.hear-my-health.mood.segment"
          ); */
          /*  dataTemp.forEach((e) => {
            const ee = {
              date: this.formatDateTable(start),
              data: e.value !== null ? e.value : 0,
            };
            tt.push(ee);
          }); */
          const dataTemp = this.overageValueDataSet(dd)
          const ee = {
            date: this.formatDateTable(start),
            data:
              dataTemp !== undefined && dataTemp !== null ? dataTemp.value : 0
          }
          tt.push(ee)
          start = dateEnd
        }
      }
      console.log(tt)
      return tt
    },

    dataSleepDeepSleep () {
      const tt = []
      const tt2 = []
      const dateStartTime = new Date(this.dateStart).getTime()
      const end = new Date(this.dateEnd)
      end.setDate(end.getDate() + 1)
      const dateEndTime = end.getTime()
      const dd = (dateEndTime - dateStartTime) / 86400000

      let start = dateStartTime

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000
          const dd = this.$store.state.dataSet.filter(
            s => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          )
          /* const dataTemp1 = dd.filter(
            (s) => s.dataTypeName === "com.google.sleep.segment"
          );
          const dataTemp2 = dd.filter(
            (s) => s.dataTypeName === "app.web.hear-my-health.sleep.deep"
          );
          dataTemp1.forEach((e) => {
            const ee = {
              date: this.formatDateTable(start),
              data: e.value !== null ? e.value : 0,
            };
            tt.push(ee);
          });
          dataTemp2.forEach((e) => {
            const ee = {
              date: this.formatDateTable(start),
              data: e.value !== null ? e.value : 0,
            };
            tt2.push(ee);
          }); */

          const dataTemp1 = dd.find(
            t =>
              t.dataTypeName === 'com.google.sleep.segment' && t.value !== null
          )
          const ee1 = {
            date: this.formatDateTable(start),
            data: dataTemp1 !== undefined ? dataTemp1.value : 0
          }
          tt.push(ee1)

          const dataTemp2 = dd.find(
            t =>
              t.dataTypeName === 'app.web.hear-my-health.sleep.deep' &&
              t.value !== null
          )
          const ee2 = {
            date: this.formatDateTable(start),
            data: dataTemp2 !== undefined ? dataTemp2.value : 0
          }
          tt2.push(ee2)
          start = dateEnd
        }
      }
      const toR = {
        tt,
        tt2
      }
      return toR
    },

    /* dataSetFilterSelect() {
      if (this.selectNameData === "all") {
        return this.$store.state.dataSet;
      }
      return this.$store.state.dataSet.filter(
        (e) => e.dataTypeName === this.selectNameData
      );
    }, */
    // eslint-disable-next-line vue/return-in-computed-property
    dataSetFilterSelect () {
      if (this.selectedType === 'Salud Física') {
        return this.$store.state.dataSet.filter(
          e =>
            e.dataTypeName === 'com.google.heart_rate.bpm' ||
            e.dataTypeName === 'com.google.calories.expended' ||
            e.dataTypeName === 'com.google.step_count.delta'
        )
      } else if (this.selectedType === 'Salud Mental') {
        return this.$store.state.dataSet.filter(
          e =>
            e.dataTypeName === 'com.google.sleep.segment' ||
            e.dataTypeName === 'app.web.hear-my-health.sleep.deep' ||
            e.dataTypeName === 'app.web.hear-my-health.mood.segment'
        )
      } else {
        // eslint-disable-next-line no-useless-return
        return
      }
    },

    dataSetNotification() {
      const tt = [];
      /* const dateStartTime = new Date(this.dateStart).getTime();
      const dateEndTime = new Date(this.dateEnd).getTime();
      const dd = (dateEndTime - dateStartTime) / 86400000;
      let start = dateStartTime; */
      const dateStartTime = new Date(this.dateStart).getTime();
      const end = new Date(this.dateEnd);
      end.setDate(end.getDate() + 1);
      const dateEndTime = end.getTime();
      const dd = (dateEndTime - dateStartTime) / 86400000;
      let start = dateStartTime;

      if (this.dataSetFilterSelect.length > 0) {
        let dataSetState = []

        if (this.notificationSelectData === 'all') {
          dataSetState = this.dataSetFilterSelect.filter(
            s => s.state === 'yellow' || s.state === 'red'
          )
        } else {
          dataSetState = this.dataSetFilterSelect.filter(
            s => s.state === this.notificationSelectData
          )
        }

        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000

          const dd = dataSetState.filter(
            s => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          )
          const ee = {
            dateStart: start,
            dateEnd,
            data:
              this.selectedType === 'Salud Física'
                ? dd.filter(
                    (t) =>
                      t.dataTypeName === "com.google.heart_rate.bpm" ||
                      t.dataTypeName === "com.google.calories.expended" ||
                      t.dataTypeName === "com.google.step_count.delta"
                  )
                : dd.filter(
                    (t) =>
                      t.dataTypeName === "com.google.sleep.segment" ||
                      t.dataTypeName === "app.web.hear-my-health.sleep.deep" ||
                      t.dataTypeName === "app.web.hear-my-health.mood.segment"
                  ),
          };

          for (let i = 0; i < ee.data.length; i++) {
            for (let j = 1; j < ee.data.length; j++) {
              if (
                ee.data[i].dataTypeName === ee.data[j].dataTypeName &&
                ee.data[i].dataTypeName !==
                  "app.web.hear-my-health.mood.segment"
              ) {
                if (ee.data[i].startTimeMillis === ee.data[j].startTimeMillis) {
                  const index = ee.data.indexOf(ee.data[j]);
                  console.log("index to delete", index);
                  ee.data.splice(index, 1);
                  console.log("new array", ee.data);
                }
              }
            }
          }
          start = dateEnd;
          tt.push(ee);
        }
      }
      return tt
    }
  },

  watch: {
    dateStart (val) {
      this.dateStarFormatted = this.formatDate(this.dateStart)
    },
    dateEnd (val) {
      this.dateEndFormatted = this.formatDate(this.dateEnd)
    },
    selectedType () {
      /* if (this.selectedType === "Salud Física") {
        this.dataSetNotification = this.$store.state.dataSet.filter(
          (e) =>
            e.dataTypeName === "com.google.heart_rate.bpm" ||
            e.dataTypeName === "com.google.calories.expended" ||
            e.dataTypeName === "com.google.step_count.delta"
        );
      } else if (this.selectedType === "Salud Mental") {
        this.dataSetNotification = this.$store.state.dataSet.filter(
          (e) =>
            e.dataTypeName === "com.google.sleep.segment" ||
            e.dataTypeName === "app.web.hear-my-health.sleep.deep" ||
            e.dataTypeName === "app.web.hear-my-health.mood.segment"
        );
      } */
    }
  },

  created () {
    const date = new Date()
    this.dateEnd = date.toISOString().substr(0, 10)
    this.dateEndFormatted = this.formatDate(date.toISOString().substr(0, 10))

    date.setDate(date.getDate() - 7)
    this.dateStart = date.toISOString().substr(0, 10)
    this.dateStarFormatted = this.formatDate(date.toISOString().substr(0, 10))
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getDataSet', { uid: this.uid })
      this.$store.dispatch('getUser', { uid: this.uid })
    }
  },

  methods: {
    overageValueDataSet (dd) {
      const valueFilter = dd.filter(
        t => t.dataTypeName === 'app.web.hear-my-health.mood.segment'
      )
      if (valueFilter.length) {
        const initialValue = 0
        const average =
          valueFilter.reduce(function (total, currentValue) {
            return total + currentValue.value || 0
          }, initialValue) / valueFilter.length
        if (average) {
          return { ...valueFilter[0], value: average }
        } else {
          return null
        }
      } else {
        return null
      }
    },

    formatDateTable (item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10)
      return ss
    },

    formatDate (date) {
      if (!date) {
        return null
      }

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },

    parseDate (date) {
      if (!date) {
        return null
      }

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },

    round (num) {
      return Math.round(num * 100) / 100
    },

    nameData (scope) {
      switch (scope) {
        case 'com.google.heart_rate.bpm':
          return 'Ritmo cardiaco'
        case 'com.google.step_count.cadence':
          return 'Cadencia de conteo de pasos'
        case 'com.google.step_count.delta':
          return 'Delta de recuento de pasos'
        case 'com.google.calories.expended':
          return 'Calorías quemadas'
        case 'com.google.sleep.segment':
          return 'Sueño'
        case 'app.web.hear-my-health.sleep.deep':
          return 'Sueño profundo'
        case 'app.web.hear-my-health.mood.segment':
          return 'Estado de animo'
        default:
          return 'desconocido'
      }
    }
  }
}
</script>
<style lang="scss">
.fixed-height-container {
  height: calc(100vh - 328px);
}

.fixed-container {
  height: 524px;
  overflow: auto;
}
</style>
