<template>
  <div id="support">
      <div v-if="messages.length < 1" class="no-selected">
          <p>لا يوجد رسائل حاليا</p>
          <button></button>
      </div>

      <div v-else class="custom-table">
        <div class="mt-3 mb-3"></div>
        <h1>رسائل الدعم الفني</h1>
        <div class="mt-3 mb-3"></div>
        <div class="row">
            <div class="col-sm-12 col-md-6 col-lg-3 col-xl-4 mb-3" v-for="(message) in messages" :key="message.id">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title border-bottom pb-3">{{ message.user.username }}</h5>
                        <p class="card-text">
                            {{ message.message.slice(0, 10) + '...' }}
                        </p>
                    </div>

                    <div class="card-footer">
                        <div class="btn-group w-100">
                            <button class="btn btn-primary w-50" @click="showMessage(message)"><Icon type="ios-chatboxes-outline" /></button>
                            <button class="btn btn-info w-50" @click="getUserInfo(message.user.username); modal2 = true;"><Icon type="ios-information-circle-outline" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

    <Modal footer-hide v-model="modal1" width="650">
        <div slot="header">
        عرض الرسالة
        </div>
        <blockquote class="blockquote">
            <p class="mb-0">{{ content }}</p>
        </blockquote>
    </Modal>

    <Modal footer-hide v-model="modal2" @on-cancel="mobileNumber = ''">
        <div slot="header">
        رقم الهاتف  
        </div>
        <a :href="'tel:' + mobileNumber"><p class="text-center" style="font-weight: bolder; font-size: 30px; direction: ltr;">{{ mobileNumber }}</p></a>
        <Spin v-show="isLoading" fix>
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </Modal>
  </div>
</template>

<script>
import baseUrl from '../apis';
export default {
    data() {
        return {
            messages: '',
            content: '',
            modal1: false,
            modal2: false,
            userid: [],
            token: '',
            isLoading: false,
            messageId: '',
            mobileNumber: '',
        }
    },
    mounted() {
        let token = localStorage.getItem('token');
        this.axios.get(`${baseUrl}/support/getSupportRequests`, 
        {
            headers: {
                Authorization: 'bearer ' + token
            }
        }).then((result) => {
            this.messages = result.data;
        }).catch((err) => {
            console.error(err);
        });
    },
    methods: {
        showMessage(message) {
            this.content = message.message;
            this.modal1 = true;
        },

        getUserInfo(name) {
            let self = this;
            let token = localStorage.getItem('token');
            this.isLoading = true;

            self.axios.get(`${baseUrl}/users/getUsers?Username=${name}`, 
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                this.isLoading = false;
                this.mobileNumber = result.data[0].userInfo.mobileNo;
            }).catch((err) => {
                this.isLoading = false;
                throw new Error(err);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
 .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
#support {
    display: block;
    height: 100%;
    width: 100%;

    .no-selected {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        p {
        font-size: 25px;
        color: #0000002e;
        border: 2px solid;
        padding: 20px;
        border-radius: 50px;
        min-width: calc(120px * 4 + 20px);
        text-align: center;
        }
    }
}
</style>