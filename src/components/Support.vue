<template>
  <div id="support">
      <div v-if="messages.length < 1" class="no-selected">
          <p>لا يوجد رسائل حاليا</p>
      </div>

      <div v-else class="custom-table">
        <div class="mt-3 mb-3"></div>
        <h1>رسائل الدعم الفني</h1>
        <div class="mt-3 mb-3"></div>
        <div class="row">
            <div class="col-sm-12 col-md-6 col-lg-3 col-xl-4 mb-3" v-for="(message, index) in messages" :key="message.id">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">الرسالة رقم {{ index }}</h5>
                        <p class="card-text">
                            {{ message.message.slice(0, 10) + '...' }}
                        </p>
                    </div>

                    <div class="card-footer">
                        <button class="btn btn-primary btn-block" @click="getMessage(index)">عرض الرسالة</button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <Modal footer-hide v-model="modal1">
        <div slot="header">
            عرض الراسلة
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
            // messages: [
            //     {
            //         "id": 14,
            //         "userId": 81,
            //         "message": "تجربة الدعم",
            //         "createdAt": "2019-12-16T20:15:57.877914-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 13,
            //         "userId": 39,
            //         "message": "مرحبا",
            //         "createdAt": "2019-12-16T13:13:43.529807-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 12,
            //         "userId": 78,
            //         "message": "ماريد شي",
            //         "createdAt": "2019-12-16T05:20:33.469154-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 11,
            //         "userId": 59,
            //         "message": "تيست",
            //         "createdAt": "2019-12-14T09:26:30.018441-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 10,
            //         "userId": 186,
            //         "message": "جميل جدا",
            //         "createdAt": "2019-12-13T17:43:17.595461-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 9,
            //         "userId": 149,
            //         "message": "Hi test ",
            //         "createdAt": "2019-12-10T12:54:04.821542-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 8,
            //         "userId": 84,
            //         "message": "اكتب هنا",
            //         "createdAt": "2019-12-06T18:43:26.043105-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 7,
            //         "userId": 82,
            //         "message": "Support",
            //         "createdAt": "2019-12-05T08:56:13.47607-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 6,
            //         "userId": 39,
            //         "message": "هنا الدعم",
            //         "createdAt": "2019-12-05T03:19:20.312835-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 5,
            //         "userId": 39,
            //         "message": "اكتىةتننب هنا",
            //         "createdAt": "2019-12-03T09:45:33.982766-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 4,
            //         "userId": 39,
            //         "message": "الى هنا وتنتهي عشرتكم الي مو حلوة",
            //         "createdAt": "2019-12-03T09:45:25.011916-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 3,
            //         "userId": 39,
            //         "message": "مرحبا",
            //         "createdAt": "2019-12-03T09:45:22.595883-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 2,
            //         "userId": 39,
            //         "message": "Hi",
            //         "createdAt": "2019-12-03T09:44:47.145828-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     },
            //     {
            //         "id": 1,
            //         "userId": 59,
            //         "message": "Hello world",
            //         "createdAt": "2019-11-30T13:57:56.543525-05:00",
            //         "updatedAt": null,
            //         "deletedAt": null,
            //         "user": null
            //     }
            // ],
            messages: '',
            content: '',
            modal1: false
        }
    },
    mounted() {
        this.getMessage();
    },
    methods: {
        getMessage(id) {
            let token = localStorage.getItem('token');
            let self = this;
            self.axios.get(`${baseUrl}/support/getSupportRequests`, {
                headers: {
                    Authorization: "bearer " + token
                }
            }).then((result) => {
                this.messages = result.data;
                console.log(result);
            }).catch((err) => {
                console.log(err);
            });
            this.content = this.messages[id].message;
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