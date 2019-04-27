<template>
  <main class="register-page md-layout md-alignment-center-center">
    <md-card class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
      <md-card-header>
        <div class="md-title">Register</div>
      </md-card-header>

      <!-- Register Form -->
      <form @submit.prevent="registerUser">
        <md-card-content>
          <md-field md-clearable>
            <label for="email">Email</label>
            <md-input :disabled="loading" type="email" name="email" id="email" autocomplete="email" v-model="form.email" />
          </md-field>

          <md-field>
            <label for="password">Password</label>
            <md-input :disabled="loading" type="password" name="password" id="password" autocomplete="password" v-model="form.password" />
          </md-field>
        </md-card-content>

        <!-- Card Actions -->
        <md-card-actions>
          <md-button @click="$router.push('/login')">Go to Login</md-button>
          <md-button class="md-primary md-raised" type="submit">Submit</md-button>
        </md-card-actions>
      </form>

      <md-snackbar :md-active.sync="isAuthenticated">
        {{form.email}} was successfully registered!
      </md-snackbar>
    </md-card>
  </main>
</template>

<script>
export default {
  data: () => ({
    form: {
      email: '',
      password: ''
    }
  }),
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  watch: {
    isAuthenticated(value) {
      if (value) {
        setTimeout(() => this.$router.push('/'), 2000)
      }
    }
  },
  methods: {
    async registerUser() {
      await this.$store.dispatch('authenticateUser', {
        email: this.form.email,
        password: this.form.password,
        returnSecureToken: true
      })
    }
  }
}
</script>


<style lang="scss">
@import '~assets/theme.scss';

.register-page {
  height: 100vh;
}
</style>
