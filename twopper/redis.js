const redis = require('redis');

const client = redis.createClient()

client.set('name', 'Matt')

client.get('name', (err, res) => {
  console.log(res)
})



client.quit()
