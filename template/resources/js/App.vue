export default {
  name: "App",
  created() {
    this.$store.dispatch("fetchUser").catch(() => {
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "login" })
      }
    })
  },
}
