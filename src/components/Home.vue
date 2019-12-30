<template>
  <div id="#home" class="h-100">
      <div class="d-flex flex-column h-100 w-100 align-items-center justify-content-center">
          <h1>
              مرحبا بك {{ username }} 
          </h1>
          <p>قم بتصفح الموقع</p>
      </div>
  </div>
</template>

<script>
import baseUrl from '../apis';
export default {
    data() {
        return {
            username: ''
        }
    },
    mounted() {
        let token = localStorage.getItem('token');
        let self = this;
        this.username = this.parseJwt(token).username;
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
    }
}
</script>

<style>

</style>