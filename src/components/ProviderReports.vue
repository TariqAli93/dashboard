<template>
  <div class="user-report pt-3">
      <h1 class="mb-4 mt-3">تقارير مزودين الخدمات</h1>
      <div class="row">
          <div class="col">
            <label>اسم المزود</label>
            <Select v-model="userSearch" filterable remote :remote-method="getProviderById" clearable @on-clear="clearMethod()">
                <Option v-for="(data, index) in providers" :value="index" :key="index">{{ data.username }}</Option>
            </Select>
          </div>
      </div>

      <div class="h-100 d-flex flex-column align-items-center mt-5 mb-5">
          <div v-show="showTable" class="custom-table w-100 ">
              <div class="table-responsive-xl">
                <Spin fix v-show="spinShow" size="large">
                  <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                  <div>جاري تحميل البيانات</div>
                </Spin>
                <table class="table table-borderless ">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">اسم المستخدم</th>
                            <th scope="col">اسم الخدمة</th>
                            <th scope="col">سعر الخدمة</th>
                            <th scope="col">المحافظة</th>
                            <th scope="col">المنطقة</th>
                            <th scope="col">تاريخ الطلب</th>
                            <th scope="col">حالة الطلب</th>
                        </tr>
                    </thead>
                    <tbody>
                          <tr id="userRole" v-for="(data, index) of request" :key="index">
                            <td scope="row">{{ data.user.username }}</td>
                            <td scope="row">{{ data.provider.name }}</td>
                            <td scope="row">{{ data.provider.price }}</td>
                            <td scope="row">{{ data.provider.governorate }}</td>
                            <td scope="row">{{ data.provider.district }}</td>
                            <td scope="row">{{ formatDate(data.provider.createdAt) }}</td>
                            <td scope="row">{{ data.requestStatus.name }}</td>
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
            showTable: false,
            providers: '',
            spinShow: false,
            request: '',
            oldData: '',
        }
    },
    mounted() {
        let token = localStorage.getItem('token');
        this.axios.get(`${baseUrl}/users/getUsers?RoleId=2`, 
        {
          headers: {
            Authorization: 'bearer ' + token
          }
        }).then((result) => {
          this.providers = result.data;
        }).catch((err) => {
          console.error(err);
        });
    },
    methods: {
        getProviderById(val) {
          let token = localStorage.getItem('token');
          this.spinShow = true;
          this.axios.get(`${baseUrl}/users/getUsers?RoleId=3&&Username=${val}`, 
          {
            headers: {
              Authorization: 'bearer ' + token
            }
          }).then((result) => {
            this.getRequest(result.data[0].id);
            this.spinShow = false;
          }).catch((err) => {
            console.error(err);
            this.spinShow = false;
          });
        },

        clearMethod() {
            return this.request = this.oldData;
        },

        getRequest(id) {
          let token = localStorage.getItem('token');
          this.spinShow = true;
          this.axios.get(`${baseUrl}/request/getProviderRequestsWeb?id=${id}`, 
          {
            headers: {
              Authorization: 'bearer ' + token
            }
          }).then((result) => {
            this.request = result.data;
            this.spinShow = false;
            this.showTable = true;
          }).catch((err) => {
            console.error(err);
            this.spinShow = false;
          });
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