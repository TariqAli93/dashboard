<template>
  <div id="#home" class="h-100">
      <div class="d-flex flex-column h-100 w-100 align-items-center justify-content-center">
          
      </div>
  </div>
</template>

<script>
import baseUrl from '../apis';
export default {
    data() {
        return {
            users: '',
            providers: '',
            admins: '',
            Superadmins: '',
        }
    },
    mounted() {
        let token = localStorage.getItem('token');
        let self = this;
        
        // get admin
        self.axios.get(`${baseUrl}/users/getUsers?RoleId=1`,
        {
            headers: {
                Authorization: "bearer " + token
            }
        }).then((result) => {
         
            this.admins = result.data.length;
        }).catch((err) => {
            console.log(err);
        });

        // get providers
        self.axios.get(`${baseUrl}/users/getUsers?RoleId=2`,
        {
            headers: {
                Authorization: "bearer " + token
            }
        }).then((result) => {
         
            this.providers = result.data.length;
        }).catch((err) => {
            console.log(err);
        });

        // get users
        self.axios.get(`${baseUrl}/users/getUsers?RoleId=3`,
        {
            headers: {
                Authorization: "bearer " + token
            }
        }).then((result) => {
         
            this.users = result.data.length;
        }).catch((err) => {
            console.log(err);
        });

        // get superadmins
        self.axios.get(`${baseUrl}/users/getUsers?RoleId=4`,
        {
            headers: {
                Authorization: "bearer " + token
            }
        }).then((result) => {
         
            this.Superadmins = result.data.length;
        }).catch((err) => {
            console.log(err);
        });

        let data = {
            datasets: [{
                data: [this.users, this.providers, this.admins, this.Superadmins]
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Users',
                'Providers',
                'Admins',
                'SuperAdmins'
            ]
        };
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