const fs = require('fs');
const path = require("path");
function delDir(path){
  let files = [];
  if(fs.existsSync(path)){
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()){
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

function emptyDir(dirPath) {
  const dirContents = fs.readdirSync(dirPath); // List dir content
  for (const fileOrDirPath of dirContents) {
    try {
      const fullPath = path.join(dirPath, fileOrDirPath);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (fs.readdirSync(fullPath).length) emptyDir(fullPath);
        fs.rmdirSync(fullPath);
      } else {
        fs.unlinkSync(fullPath);
      }
    } catch (ex) {
      console.error(ex.message);
    }
  }
  fs.rmdirSync(dirPath);
}

module.exports = {
  delDir,
  emptyDir
};
