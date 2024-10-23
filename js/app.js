/**
 * Appwrite
 */
const { Client, Account } = Appwrite
const client = new Client()
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66db23330023a284ff78')
const account = new Account(client);

/**
 * Main application
 */
var vm = new Vue({
  el: '#app',
  template: '#main',
  vuetify: new Vuetify(),
  data () {
    return {
      client,
      account,
    }
  }
})
