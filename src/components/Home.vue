<template>
  <div id="#home" class="h-100">
      <div class="d-flex flex-column h-100 w-100 align-items-center justify-content-center">
          <h1>مرحبا بك <b>{{ username }}</b></h1>
          <h6>قم بتصفح الموقع</h6>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
        }
    },
    mounted() {
        this.getUsername();
    },
    methods: {
        parseJwt(token) {
            var base64Url = token.split(".")[1];
            var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            var jsonPayload = decodeURIComponent(
                atob(base64)
                .split("")
                .map(function(c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
            );
            return JSON.parse(jsonPayload);
        },

        getUsername() {
            let token = localStorage.getItem('token');
            let parsedToken = this.parseJwt(token);
            let username = parsedToken.username;
            this.username = username;
        }
    }
}
</script>

<style>

</style>