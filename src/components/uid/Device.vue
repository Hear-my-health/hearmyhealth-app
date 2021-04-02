<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="10">
      <!-- <v-data-table
        :headers="headers"
        :items="dataSourceState"
        :sort-by="['type', 'type']"
        :sort-desc="[false, true]"
        multi-sort
        class="elevation-0"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Dispositivos IoT </v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
          </v-toolbar>
        </template>
        <template #[`item.device`]="{ item }">
          <span v-if="item.device">
            {{ item.device.uid }}
          </span>
        </template>
        <template #[`item.type`]="{ item }">
          <span v-if="item.device">
            {{ item.device.type }}
          </span>
        </template>
        <template #[`item.application`]="{ item }">
          <span v-if="item.device">
            {{ item.device.model }}
          </span>
        </template>
      </v-data-table> -->
      <v-data-table
        :headers="headers"
        :items="uniqueDevices"
        multi-sort
        class="elevation-1"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Fuente de datos </v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
          </v-toolbar>
        </template>
        <template>
          <span>
            {{ uniqueDevices.uid }}
          </span>
        </template>
        <template>
          <span>
            {{ uniqueDevices.type }}
          </span>
        </template>
        <template>
          <span>
            {{ uniqueDevices.model }}
          </span>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ["myUid"],
  data() {
    return {
      uid: this.$props.myUid,
      uniqueDevices: [],
      headers: [
        // {
        //   text: 'Name',
        //   align: 'start',
        //   sortable: false,
        //   value: 'device'
        // },
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "uid",
        },
        {
          text: 'Dispositivo',
          align: 'start',
          sortable: false,
          value: "type",
        },
        {
          text: 'Modelo',
          align: 'start',
          sortable: false,
          value: "model",
        },
      ],
    };
  },

  async fetch({ store }) {
    try {
      await store.dispatch("getDevices", { uid: this.uid });
    } catch (e) {
      return "error";
    }
  },

  computed: {
    auth() {
      return this.$store.state.authUser || null;
    },

    dataSourceState() {
      return this.$store.state.devices ? this.$store.state.devices.data : [];
    },
  },

  mounted() {
    const { authUser } = this.$store.state;
    if (!authUser) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("getDevices", { uid: this.uid });
    }
  },

  watch: {
    dataSourceState() {
      if (this.dataSourceState) {
        this.setUniqueDevices();
        /*  console.log(this.uniqueDevices); */
      }
    },
  },

  methods: {
    async setUniqueDevices() {
      let modelNames = this.dataSourceState.map((e) => {
        return e.device.model;
      });
      let models = this.dataSourceState.map((e) => {
        let c = [];
        c.uid = e.device.uid;
        c.type =
          e.device.type === "phone"
            ? "Pulsera inteligente"
            : uniqueDevices.type === "watch"
            ? "Reloj inteligente"
            : "Otro dispositivo";
        c.model = e.device.model;
        return c;
      });
      let v = [];
      for (let i = 0; i < models.length; i++) {
        if (v.some((e) => e.model === modelNames[i])) {
        } else {
          v.push(models[i]);
        }
      }
      this.uniqueDevices = v;
    },
    nameData(scope) {
      switch (scope) {
        case "com.google.heart_rate.bpm":
          return "Ritmo cardiaco";
        case "com.google.sleep.segment":
          return "Dormir";
        case "com.google.step_count.cadence":
          return "Cadencia de conteo de pasos";
        case "com.google.step_count.delta":
          return "Delta de recuento de pasos";
        case "com.google.calories.expended":
          return "Calorías quemadas";
        default:
          return "desconocido";
      }
    },
  },
};
</script>
