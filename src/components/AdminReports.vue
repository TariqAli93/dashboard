<template>
  <div class="user-report pt-3">
      <h1 class="mb-4 mt-3">تقارير الادمن</h1>
      <div class="row">
          <div class="col">
            <label>السجل حسب الاسم</label>
            <Select filterable remote :remote-method="getLogByName" clearable>
                <Option v-for="admin in admins" :value="admin.id" :key="admin.id">{{ admin.username }}</Option>
            </Select>
          </div>

          <div class="col">
            <label>السجل حسب الحالة</label>
            <Select filterable remote :remote-method="getLogByActionCode" clearable>
                <Option v-for="action in actions" :value="action.id" :key="action.id">{{ action.name }}</Option>
            </Select>
          </div>

          <div class="col">
            <label>السجل حسب المحافظة</label>
            <Select filterable remote :remote-method="getLogByGover" clearable>
                <Option v-for="gover in governorate" :value="gover.id" :key="gover.id">{{ gover.name }}</Option>
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
                            <th scope="col">#</th>
                            <th scope="col">الادمن</th>
                            <th scope="col">الحالة</th>
                            <th scope="col">المستخدم</th>
                            <th scope="col">التاريخ</th>
                        </tr>
                    </thead>
                    <tbody>
                          <tr id="userRole" v-for="(data, index) of result" :key="index">
                            <td scope="row">{{ data.id }}</td>
                            <td scope="row">{{ data.user.username }}</td>
                            <td scope="row">
                                <span v-if="data.actionCode === 0">اضافة</span>
                                <span v-else-if="data.actionCode === 1">حذف</span>
                                <span v-else-if="data.actionCode === 2">تحديث</span>
                                <span v-else-if="data.actionCode === 3">تغير كلمة المرور</span>
                                <span v-else>استعادة كلمة المرور</span>
                            </td>
                            <td scope="row">Id: {{ data.newUserId }}</td>
                            <td scope="row">{{ formatDate(data.createdAt) }}</td>
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
            actionsCodes: '',
            adminLog: '',
            governorateModal: '',
            result: '',
            showTable: false,
            dataSize: '',
            spinShow: false,
            actions: [
                {
                    id: 0,
                    name: 'اضافة' 
                },
                {
                    id: 1,
                    name: 'حذف' 
                },
                {
                    id: 2,
                    name: 'تحديث' 
                },
                {
                    id: 3,
                    name: 'تغير كلمة المرور' 
                },
                {
                    id: 4,
                    name: 'استعادة كلمة المرور' 
                }
            ],
            admins: '',
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
        this.axios.get(`${baseUrl}/users/getUsers?RoleId=1&&RoleId=4`, 
        {
          headers: {
            Authorization: 'bearer ' + token
          }
        }).then((result) => {
          console.log(result);
          this.admins = result.data;
        }).catch((err) => {
          console.error(err);
        });
    },
    methods: {
        getLogByName(id) {
            let token = localStorage.getItem('token');
            this.spinShow = true;
            this.axios.get(`${baseUrl}/reports/adminProviders?Username=${id}`,
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                console.log(result);
                this.result = result.data;
                this.showTable = true;
                this.dataSize = result.data.length;
                this.spinShow = false;
            }).catch((err) => {
                console.error(err);
            });
        },
        getLogByActionCode(ActionCode) {
            let token = localStorage.getItem('token');
            let action = '';
            this.spinShow = true;
            if(ActionCode === 'اضافة') {
                action = 0;
            } else if(ActionCode === 'حذف') {
                action = 1;
            } else if(ActionCode === 'تحديث') {
                action = 2;
            } else if(ActionCode === 'تغير كلمة المرور') {
                action = 3;
            } else {
                action = 4;
            }
            this.axios.get(`${baseUrl}/reports/adminProviders?ActionCode=${action}`,
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                console.log(result);
                this.result = result.data;
                this.showTable = true;
                this.dataSize = result.data.length;
                this.spinShow = false;
            }).catch((err) => {
              this.spinShow = false;
            });

            console.log(ActionCode)
        },
        getLogByGover(Government) {
            let token = localStorage.getItem('token');
            this.spinShow = true;
            this.axios.get(`${baseUrl}/reports/adminProviders?Government=${Government}`,
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                console.log(result);
                this.result = result.data;
                this.showTable = true;
                this.dataSize = result.data.length;
                this.spinShow = false;
            }).catch((err) => {
                this.spinShow = false;
            });
        },
        getUserById(id) {
            let token = localStorage.getItem('token');
            this.spinShow = true;
            this.axios.get(`${baseUrl}users/getUserInfo`, 
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                this.spinShow = false;
            }).catch((err) => {
                this.spinShow = false;
            });
        },
        formatDate(date) {
            return moment(date).format('D/M/YYYY');
        },
    }
}
</script>

<style>

</style>