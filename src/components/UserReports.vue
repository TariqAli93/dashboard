<template>
  <div class="user-report pt-3">
      <h1 class="mb-4 mt-3">تقارير المستخدمين</h1>
      <div class="row">
          <div class="col">
            <label>بحث في المستخدمين</label>
            <Select v-model="userSearch" filterable remote :remote-method="getQuery" clearable @on-clear="clearMethod()">
                <Option v-for="(data, index) in users" :value="index" :key="index">{{ data.username }}</Option>
            </Select>
          </div>

          <div class="col">
            <label>المستخدمين حسب المنطقة</label>
            <Select v-model="userByAddress" filterable remote :remote-method="getQuery2" clearable @on-clear="clearMethod()">
                <Option v-for="(gover, index) in governorate" :value="index" :key="index">{{ gover.name }}</Option>
            </Select>
          </div>

          <div class="col">
            <label>المستخدمين حسب التصنيف</label>
            <Select v-model="userByCategory" filterable @on-change="getQuery3" clearable @on-clear="clearMethod()">
                <Option v-for="category in categories" :value="category.id" :key="category.id">{{ category.name }}</Option>
            </Select>
          </div>
      </div>

      <div class="h-100 d-flex flex-column align-items-center mt-5 mb-5">
          <div class="custom-table w-100 ">
              <div class="table-responsive-xl">
                <Spin fix v-show="spinShow" size="large">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>جاري تحميل البيانات</div>
                </Spin>
                <table class="table table-borderless ">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">اسم المستخدم</th>
                            <th scope="col">رقم المستخدم</th>
                            <th scope="col">عنوان المستخدم</th>
                            <th scope="col">صلاحيات</th>
                            <th scope="col">تاريخ الانشاء</th>
                            <th scope="col">تاريخ الانتهاء</th>
                        </tr>
                    </thead>
                    <tbody>
                          <tr id="userRole" v-for="(data, index) of users" :key="index">
                            <td scope="row">{{ data.id }}</td>
                            <td scope="row">{{ data.username }}</td>
                            <td scope="row">{{ data.userInfo.mobileNo }}</td>
                            <td scope="row">{{ data.userInfo.address1 }}</td>
                            <td scope="row">
                                <span v-for="role in data.userRole" :key="role.roleId">
                                    <b v-if="role.roleId == 1">Admin </b>
                                    <b v-else-if="role.roleId == 2">Provider </b>
                                    <b v-else-if="role.roleId == 4">SuperAdmin </b>
                                    <b v-else>User </b>
                                </span>
                            </td>
                            <td scope="row">{{ formatDate(data.validFrom) }}</td>
                            <td scope="row">
                                <span v-if="isExpierd(formatDate(data.validTo))">{{ formatDate(data.validTo) }}</span>
                                <span v-else style="color: red;">الحساب منتهي</span>
                            </td>
                        </tr>  
                    </tbody>
                </table>
            </div>   
          </div>
      </div>
  </div>
</template>

<script>
import baseUrl from '../apis'
import moment from "../../node_modules/moment";
export default {
    data() {
        return {
            userSearch: '',
            userByAddress: '',
            userByCategory: '',
            queryUrl: '',
            query: '',
            showTable: false,
            users: '',
            categories: '',
            oldData: '',
            spinShow: false,
            governorate: [
            {
              "name":'اربيل',
              "id": 1
            },
            {
              "name":'الانبار',
              "id": 2
            },
            {
              "name":'بابل',
              "id": 3
            },
            {
              "name":'بغداد',
              "id": 4
            },
            {
              "name":'البصرة',
              "id": 5
            },
            {
              "name":'دهوك',
              "id": 6
            },
            {
              "name":'القادسية',
              "id": 7
            },
            {
              "name":'ديالى',
              "id": 8
            },
            {
              "name":'ذي قار',
              "id": 9
            },
            {
              "name":'سليمانية',
              "id": 10
            },
            {
              "name":'صلاح الدين',
              "id": 11
            },
            {
              "name":'كركوك',
              "id": 12
            },
            {
              "name":'كربلاء',
              "id": 13
            },
            {
              "name":'المثنى',
              "id": 14
            },
            {
              "name":'ميسان',
              "id": 15
            },
            {
              "name":'النجف',
              "id": 16
            },
            {
              "name":'نينوى',
              "id": 17
            },
            {
              "name":'واسط',
              "id": 18
            }
          ],
        }
    },
    mounted() {
        let token = localStorage.getItem('token');
        this.axios.get(`${baseUrl}/users/getUsers`, {
            headers: {
                Authorization: 'bearer ' + token
            }
        }).then((result) => {
            this.users = result.data;
            this.oldData = result.data;
        }).catch((err) => {
        });

        this.getCategories();
    },
    methods: {
        getCategories() {
            let self = this;
            let token = localStorage.getItem('token');
            self.axios.get(`${baseUrl}/category/getCategories`,
            {
                headers: {
                Authorization: "bearer " + token
                }
            }).then((result) => {
            this.categories = result.data;
            }).catch((err) => {
            });
        },

        clearMethod() {
            return this.users = this.oldData;
        },

        getQuery(query) {
            if(query.length > 0) {
                this.showTable = true;
                this.spinShow = true;
                let token = localStorage.getItem('token');
                this.axios.get(`${baseUrl}/users/getUsers?Username=${query}`, 
                {
                    headers: {
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    this.users = result.data;
                    this.spinShow = false;
                }).catch((err) => {
                    this.spinShow = false;
                });
            } else {
                this.showTable = false;
                this.users = this.oldData;
            }
        },

        getQuery2(query) {
            if(query) {
                this.showTable = true;
                this.spinShow = true;
                let token = localStorage.getItem('token');
                this.axios.get(`${baseUrl}/users/getUsers?Address1=${query}`, 
                {
                    headers: {
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    this.users = result.data;
                    this.spinShow = false;
                }).catch((err) => {
                    this.spinShow = false;
                });
            } else {
                this.showTable = false;
            }
        },

        getQuery3(query) {
            if(query) {
                this.showTable = true;
                this.spinShow = true;
                let token = localStorage.getItem('token');
                this.axios.get(`${baseUrl}/users/getUsers?CategoryId=${query}`, 
                {
                    headers: {
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    this.users = result.data;
                    this.spinShow = false;
                }).catch((err) => {
                    this.spinShow = false;
                });
            } else {
                this.showTable = false;
            }
        },
        formatDate(date) {
            return moment(date).format('D/M/YYYY');
        },
        isExpierd(date) {
            let today = moment().format("D/M/YYYY");
            if(today === date) {
                return false;
            } else {
                return true;
            }
        },
    }
}
</script>

<style>
.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>