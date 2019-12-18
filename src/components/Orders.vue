<template>
  <div id="orders">
      <div class="no-selected">
          <p>لا يوجد اي طلبات حاليا</p>
      </div>

    <Tabs type="card" :animated="false">
        <TabPane label="provider orders" name="ProviderOrders">
            <Table border :columns="columns12" :data="data6">
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
                    <Button type="error" size="small" @click="remove(index)">Delete</Button>
                </template>
            </Table>
        </TabPane>
        <TabPane label="user orders" name="UserOrders">
            <h1>Test Tab 2</h1>
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import baseUrl from "../apis";
export default {
    data() {
        return {
            columns12: [
                {
                    title: 'Name',
                    slot: 'name'
                },
                {
                    title: 'Age',
                    key: 'age'
                },
                {
                    title: 'Address',
                    key: 'address'
                },
                {
                    title: 'Action',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            providerServices: '',
            userServices: ''
        }
    },
    mounted() {
        this.getProviderServices();
    },
    methods: {
        getProviderServices() {
            let self = this;
            let token = localStorage.getItem('token');
            self.axios.get(`${baseUrl}/request/getProviderRequests`, {headers: {'Authorization': `bearer  ${token}`}})
            .then((result) => {
                console.log(result);   
            }).catch((err) => {
                console.error(err);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
#orders {
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