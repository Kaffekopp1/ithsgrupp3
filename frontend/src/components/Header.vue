<script setup>

</script>

<template>
  <b-container fluid="lg" class="mt-2 mb-3">
    <b-navbar toggleable="lg" type="white" variant="white">
      <b-navbar-brand to="/" class="fs-3">PCA</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" class="justify-content-between" is-nav>
        <b-navbar-nav class="fs-5 mt-1">
          <b-nav-item to="/">🏠 Hem</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="gap-1">
          <b-nav-form class="gap-1">
            <!-- <b-form-select v-model="selected" :options="searchCategories" required></b-form-select> -->
            <b-form-input class="mr-sm-1" placeholder="Vad vill du söka? 🔎" v-model="searchInput"
              required></b-form-input>
            <b-button variant="primary" class="my-2 my-sm-0" type="submit" @click="search()"
              :disabled="isDisabled">Sök</b-button>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </b-container>
</template>

<style scoped></style>
