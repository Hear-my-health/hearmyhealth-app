<template>
  <div>
    <section>
      <v-parallax :src="imageLink.main" height="450">
        <v-layout column align-center justify-center class="white--text">
          <h1
            class="white--text mb-2 display-3 text-xs-center"
            style="font-weight: 900"
          >
            Hear my Health
          </h1>
          <div
            class="white--text display-1 mb-3 text-xs-center"
            style="font-weight: 900"
          >
            Decisiones médicas basadas en datos
          </div>
          <v-btn
            class="lighten-1 mt-6"
            style="max-width: 180px; color: white; background: #0c314c"
            large
            href="/login"
          >
            Ir a la app
          </v-btn>
          <div id="product" />
        </v-layout>
      </v-parallax>
    </section>
    <section>
      <v-layout column wrap class="my-5" align-center>
        <v-flex xs12 sm4 class="my-3">
          <div class="text-xs-center">
            <h2 class="headline">
              Piloto de monitoreo continuo de pacientes con anorexia y bulimia
            </h2>
            <br>
            <div class="display-2" style="text-align: center; color: #0bc5c3">
              ¿Qué ofrecemos?
            </div>
          </div>
        </v-flex>
      </v-layout>
      <v-container grid-list-xl>
        <v-layout row wrap align-center>
          <v-flex pa-10 xs12 md6>
            <v-card class="elevation-0 transparent">
              <v-img
                class="ma-auto"
                max-width="170"
                src="https://firebasestorage.googleapis.com/v0/b/mace-d54b3.appspot.com/o/disponibilidad2.png?alt=media&token=d66d381e-bfc3-4a56-b4e9-37704244fb33"
              />
              <v-card-title primary-title class="layout justify-center">
                <div class="headline text-xs-center">
                  Datos e indicadores
                </div>
              </v-card-title>
              <v-card-text class="text-center">
                El piloto almacena y analiza los datos del paciente recopilados
                de wearables como pulseras o relojes inteligentes, con el fin de
                generar indicadores fisiológicos, psicológicos y nutricionales
                útiles
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex pa-10 xs12 md6>
            <v-card class="elevation-0 transparent">
              <v-img
                class="ma-auto"
                max-width="235"
                src="https://firebasestorage.googleapis.com/v0/b/mace-d54b3.appspot.com/o/especialistas.png?alt=media&token=5e6bdfc7-5b1b-49d7-b44f-e40e7214fa06"
              />
              <v-card-title primary-title class="layout justify-center">
                <div class="headline">
                  Soporte a especialistas
                </div>
              </v-card-title>
              <v-card-text class="text-center">
                El piloto genera recomendaciones en base a los datos recopilados
                del paciente con el fin de servir de soporte en las decisiones
                del especialista y así brindar mejores tratamientos
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section>
      <v-layout column wrap class="my-5" align-center>
        <v-flex xs12 sm4 class="my-3">
          <div class="text-xs-center">
            <v-text class="display-2" style="color: #0bc5c3">
              ¿Qué datos procesamos?
            </v-text>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-container grid-list-xl>
            <v-layout row wrap align-top>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-img
                    class="ma-auto"
                    max-width="80"
                    src="https://firebasestorage.googleapis.com/v0/b/mace-d54b3.appspot.com/o/saludmental.png?alt=media&token=a25e9959-b060-47ff-a6df-8a04029e29ab"
                  />
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">
                      Datos de salud mental
                    </div>
                  </v-card-title>
                  <v-card-text class="text-center">
                    Medimos la salud mental a través del estado de ánimo del
                    paciente y horas de sueño incluyendo el profundo
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <v-img
                      class="ma-auto"
                      max-width="75"
                      src="https://firebasestorage.googleapis.com/v0/b/mace-d54b3.appspot.com/o/saludnutricional.png?alt=media&token=df575869-26c7-49a6-82cc-d446b4799a5d"
                    />
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline">
                      Datos nutricionales
                    </div>
                  </v-card-title>
                  <v-card-text class="text-center">
                    Medimos la salud nutricional a través de la ingesta total de
                    alimentos, el peso sobrante de la comida y la duración de la
                    ingesta
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-img
                    class="ma-auto"
                    max-width="46"
                    src="https://firebasestorage.googleapis.com/v0/b/mace-d54b3.appspot.com/o/saludfisica.png?alt=media&token=0f631f06-9158-41db-bdee-93c17a91f8fa"
                  />
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">
                      Datos fisiológicos
                    </div>
                  </v-card-title>
                  <v-card-text class="text-center">
                    Medimos la salud física a través de la frecuencia cardíaca,
                    cantidad de pasos y calorías quemadas
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </section>
    <section id="contact">
      <v-parallax :src="imageLink.social_cover" height="220">
        <v-layout column align-center justify-center>
          <div class="headline white--text mb-3">
            Actualmente, la anorexia y bulimia son las enfermedades mentales más
            mortales del mundo
            <br>
          </div>
          <v-text
            style="font-style: italic; font-size: medium; text-align: right"
          >
            -Centro de Excelencia para Trastornos Alimentarios de EEUU
          </v-text>
        </v-layout>
        <!-- <v-layout justify-space-around justify-center>
          <v-icon x-large dark>
            fab fa-facebook-f
          </v-icon>

          <v-icon x-large dark>
            fab fa-twitter
          </v-icon>

          <v-icon x-large dark>
            fab fa-reddit-alien
          </v-icon>

          <v-icon x-large dark>
            fab fa-instagram
          </v-icon>

          <v-icon x-large dark>
            fab fa-discord
          </v-icon>
        </v-layout> -->
      </v-parallax>
    </section>
    <section>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 text-xs-center class="mt-5">
            <div class="headline">
              ¡Contáctanos!
            </div>
            <br>
            <div>
              Escríbenos tus sugerencias, recomendaciones o si deseas mayor
              información sobre este proyecto.
            </div>
          </v-flex>
          <v-flex xs8 offset-xs2>
            <v-card class="elevation-0 transparent">
              <v-card-text>
                <v-flex v-if="!subscribed" xs12>
                  <v-text-field
                    v-model="email"
                    label="Email address"
                    :rules="emailRules"
                    hint="Enter your email!"
                    persistent-hint
                  />
                </v-flex>
                <v-flex v-if="!subscribed" xs12>
                  <v-text-field multi-line label="Comentarios" />
                </v-flex>
                <v-flex v-if="!subscribed" xs12 class="text-xs-center">
                  <v-btn
                    class="blue lighten-2 mb-5"
                    dark
                    large
                    @click="subscribe"
                  >
                    Enviar
                  </v-btn>
                </v-flex>
                <v-flex v-if="subscribed" xs12 class="text-xs-center">
                  <v-btn class="green lighten-2 mb-5" dark large>
                    Gracias!
                  </v-btn>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>

    <!-- <section style="background: #8C8B87">
      <v-container grid-list-xl>
        <v-layout row wrap justify-center class="my-5">
          <v-flex xs12 sm4>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline">
                  Información
                </div>
              </v-card-title>
              <v-card-list>
                We are not a company. We hate companies. Just imagine us like
                the guys from the Silicon Valley series.
              </v-card-list>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4 offset-sm1>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline">
                  We are hiring
                </div>
              </v-card-title>
              <v-card-text>
                Are you a creative person? Do you like techy stuff? Complete
                the email form by writing your skills and interests
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  layout: 'landing',
  data () {
    return {
      title: 'Endorfine',
      imageLink: {
        main:
          'https://firebasestorage.googleapis.com/v0/b/hear-my-health.appspot.com/o/banprin.webp?alt=media&token=947e3460-665f-4a25-bf54-993e7b0f2347',
        social_cover:
          'https://firebasestorage.googleapis.com/v0/b/hear-my-health.appspot.com/o/slide.webp?alt=media&token=26aa3238-964a-498e-9c19-841786e4b648'
      },
      email: '',
      emailRules: [
        (v) => {
          return !!v || 'E-mail is required'
        },
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail must be valid'
      ],
      subscribed: false
    }
  },
  computed: {
    imgHeight () {
      const offset = 320
      return this.pageHeight - offset
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (authUser) {
      this.$router.push('/app')
    }
    if (localStorage.getItem('role') === 'admin') {
      this.$router.push('/back')
    }
  },

  methods: {
    subscribe () {
      this.subscribed = !this.subscribed
    }
  }
}
</script>

<style scoped>
.finedTitle {
  font-weight: 900;
  text-shadow: 2px 2px #000000;
}

.social-icon {
  font-size: 21px;
  color: white;
}
</style>
