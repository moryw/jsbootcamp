// const https = require("https")

// const data = JSON.stringify({
//   todo: "Sleep!",
// })

// const options = {
//   hostname: "ptsv2.com",
//   port: 443,
//   path: "/t/ocirt-1627056607/post",
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Content-Length": data.length,
//   },
// }

// const req = https.request(options, (res) => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on("data", (d) => {
//     process.stdout.write(d)
//   })
// })

// req.on("error", (error) => {
//   console.error(error)
// })

// req.write(data)
// req.end()

const axios = require("axios")

axios
  .post("https://ptsv2.com/t/wdv29-1621319997/post", {
    todo: "Buy the milk",
  })
  .then((res) => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error.message)
  })