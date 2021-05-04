<template>
  <div>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="basil"
      fixed-tabs
    >
      <v-tab v-for="item in tabs" :key="item.slug" :to="`#${item.slug}`">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="4" md="4">
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
        </v-menu> </v-col
    ></v-row>
    <v-tabs-items v-model="tab" class="grey lighten-5">
      <v-tab-item value="dashboard">
        <br />
        <Dashboard
          :my-uid="uid"
          :dateStart="dateStart"
          :dateEnd="dateEnd"
          class="mt-3"
        />
      </v-tab-item>
      <v-tab-item value="data">
        <Data
          :my-uid="uid"
          :dateStart="dateStart"
          :dateEnd="dateEnd"
          class="mt-4"
        />
      </v-tab-item>
      <v-tab-item value="devices" class="mt-3">
        <Device :my-uid="uid" />
      </v-tab-item>
      <v-tab-item value="thoughts" class="mt-3">
        <Thought :my-uid="uid" :dateStart="dateStart" :dateEnd="dateEnd" />
      </v-tab-item>
      <v-tab-item value="alerts" class="mt-4">
        <Alert :my-uid="uid" :dateStart="dateStart" :dateEnd="dateEnd" />
      </v-tab-item>
      <v-tab-item value="profile">
        <Profile :my-uid="uid" class="mt-3" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import moment from "moment";
import Data from "~/components/uid/Data";
import Device from "~/components/uid/Device";
import Dashboard from "~/components/uid/Dashboard";
import Profile from "~/components/uid/Profile";
import Alert from "~/components/uid/Alert";
import Thought from "~/components/uid/Thought";

export default {
  components: {
    Data,
    Device,
    Dashboard,
    Profile,
    Alert,
    Thought,
  },
  layout: "back",
  asyncData({ params }) {
    const { uid } = params;

    return { uid };
  },

  data: (vm) => ({
    dialog: false,
    isEditing: true,
    specialty: "",
    form: {
      alert: "",
      type: "",
    },
    nowDate: new Date().toISOString().slice(0, 10),
    dateStart: "",
    dateStarFormatted: "",
    dateEnd: "",
    dateEndFormatted: "",
    menu1: false,
    menu2: false,

    formTitle: "Agregar alerta",
    tab: null,
    tabs: [
      {
        name: "Dashboard",
        slug: "dashboard",
        value: "dashboard",
      },
      {
        name: "Datos",
        slug: "data",
        value: "data",
      },
      {
        name: "Dispositivos",
        slug: "devices",
        value: "devices",
      },
      {
        name: "Pensamientos",
        slug: "thoughts",
        value: "thoughts",
      },
      {
        name: "Alertas",
        slug: "alerts",
        value: "alerts",
      },
      {
        name: "Información",
        slug: "profile",
        value: "profile",
      },
    ],
    text: "loremos",
  }),

  // eslint-disable-next-line require-await
  async fetch({ store }) {
    // eslint-disable-next-line no-empty
    try {
    } catch (e) {
      return "error";
    }
  },

  computed: {
    /* user() {
      return this.$store.state.user;
    }, */
  },

  watch: {
    user() {
      this.specialty = this.user.specialty;
    },
    dateStart(val) {
      this.dateStarFormatted = this.formatDate(this.dateStart);
    },
    dateEnd(val) {
      this.dateEndFormatted = this.formatDate(this.dateEnd);
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
      // eslint-disable-next-line no-empty
    } else {
    }
  },

  methods: {
    close() {
      this.dialog = !this.dialog;
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
  },
};
</script>
