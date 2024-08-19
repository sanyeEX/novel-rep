const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = async function downloadFile(imgUrl, filepath, fileName) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
  const myPath = path.resolve(filepath, fileName);
    const writer = fs.createWriteStream(myPath); // 创建写入对象
    axios({
      url: imgUrl,
      method: "GET",
      responseType: "stream",
      timeout: 9999999
    }).then(res => {
      new Promise((resolve, reject) => {
        res.data.pipe(writer)
      })
    }).catch(err => {
      console.log(err)
    })
}