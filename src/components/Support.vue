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
                        <button class="btn btn-primary btn-block" @click="showMessage(message)">عرض الرسالة</button>
                    </div>
                </div>
            </div>
        </div>
      </div>

    <Modal footer-hide v-model="modal1">
        <div slot="header">
        عرض الرسالة
        </div>
        {{ content }}
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
            userid: [],
            token: '',
            messageId: '',
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
            console.log(result.data);
        }).catch((err) => {
            console.error(err);
        });
    },
    methods: {
        showMessage(message) {
            this.content = message.message;
            this.modal1 = true;
        }
    }
}
</script>

<style lang="scss" scoped>
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