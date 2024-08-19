const fs = require('fs');
const stringRandom = require('string-random');
const Novel = require('./model/Novel')
const Roll = require("./model/Roll");
const Chapter = require("./model/Chapter");
const ChapterContent = require('./model/ChapterContent')
const download = require('download')
const downloadFile = require('./utils/downloadFile')
const { delDir, emptyDir } = require('./utils/delDir')
const {HttpsProxyAgent} = require('hpagent');

module.exports = async (page, url) => {
  await page.goto(url, {
    timeout: 0
  })
  const infoClass = [
    '#content > div:nth-child(1)',
    '#content > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > span > b', // name
    '#content > div:nth-child(1) > table:nth-of-type(2) > tbody > tr > td:nth-child(1) > img',// picUrl
    '#content > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(2) td:nth-of-type(1)', // className
    '#content > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(2) td:nth-of-type(2)', // author
    '#content > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(2) td:nth-of-type(3)', // isSerial
    '#content > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(2) td:nth-of-type(4)', // updateTime
    '#content > div:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(2) td:nth-of-type(5)', // wordCount
    '#content > div:nth-child(1) > table:nth-of-type(2) > tbody > tr > td:nth-child(1) > span > b', // isAnimation
    '#content > div:nth-child(1) > table:nth-of-type(2) > tbody > tr > td:nth-child(2) > span:nth-child(1) > b', // classTags
    '#content > div:nth-child(1) > table:nth-of-type(2) > tbody > tr > td:nth-child(2) > span:nth-of-type(4) a', // recentChapters
    '#content > div:nth-child(1) > table:nth-of-type(2) > tbody > tr > td:nth-child(2) > span:nth-of-type(6)', // intro
    '#content > div:nth-child(1) > div:nth-of-type(4) > div > span:nth-child(1) > fieldset > div > a', // directoryUrl
  ]

  await page.waitForSelector(infoClass[0], {
    timeout: 0
  }) // 等待信息加载完成

  const name = await page.$eval(infoClass[1], element => element.innerText) // 获取小说名称
  const imgUrl = await page.$eval(infoClass[2], element => element.getAttribute('src')) // 获取小说封面

  const path = imgUrl.split('.').slice(-1)[0] // 获取后缀名
  const newStr = stringRandom(24, { numbers: false }) // 随机生成文件名
  const picUrl = `${newStr}.${path}` // 获取保存图片文件名

  const className = (await page.$eval(infoClass[3], element => element.innerText)).replace('文库分类：', '') // 获取小说分类
  const author = (await page.$eval(infoClass[4], element => element.innerText)).replace('小说作者：', '') // 获取小说作者
  const isSerial = (await page.$eval(infoClass[5], element => {
    return element.innerText.replace('文章状态：', '') === '连载中' ? 1 : 0
  })) // 获取小说是否连载
  const updateTime = (await page.$eval(infoClass[6], element => element.innerText)).replace('最后更新：', '') // 获取小说更新时间
  const wordCount = (await page.$eval(infoClass[7], element => element.innerText)).replace('全文长度：', '').replace('字', '') // 获取小说长度
  const isAnimation = await page.$(infoClass[8]) ? 1 : 0; // 获取小说是否动画化
  const classTags = (await page.$eval(infoClass[9], element => element.innerText)).replace('作品Tags：', '').split(' ').toString() // 获取小说tag列表
  const recentChapters = await page.$eval(infoClass[10], element => element.innerText) // 获取小说最新章节
  const intro = await page.$eval(infoClass[11], element => element.innerText) // 获取小说简介
  const directoryUrl = await page.$eval(infoClass[12], element => element.getAttribute('href')) // 获取小说目录链接

  // 保存爬取到的数据进行集合
  const novelInfo = {
    name,
    picUrl,
    className,
    author,
    isSerial,
    updateTime,
    wordCount,
    isAnimation,
    classTags,
    recentChapters,
    intro,
  }

  // 查询小说是否存在数据库中 true=即更新小说
  const novel = await Novel.findOne({
    where: {
      name
    }
  })
  let updateNovelInfo = ""
  // 判断小说是否存在数据库中 true=即更新小说
  if (novel) {
    // 删除封面图片
    if (fs.existsSync(`../novelImg/public/novelPic/${novel.id}`)) { // 查询并删除封面图片，然后在更新
      await emptyDir(`../novelImg/public/novelPic/${novel.id}`)
    }
    // 查询并删除插图图片，然后在更新
    if (fs.existsSync(`../novelImg/public/novelPicture/${novel.id}`)) {
      await emptyDir(`../novelImg/public/novelPicture/${novel.id}`)
    }
    
    // 更新小说
    await Novel.update(novelInfo, {
      where: {
        id: novel.id
      }
    })
    updateNovelInfo = await Novel.findOne({
      where: {
        name
      }
    })

    // 删除卷
    await Roll.destroy({ where: {
      novel_id: novel.id
    }})
    // 删除章节
    await Chapter.destroy({ where: {
      novel_id: novel.id
    }})
    // 删除内容
    await ChapterContent.destroy({ where: {
      novel_id: novel.id
    }})
  } else {
    // 创建小说基本信息
    updateNovelInfo = await Novel.create(novelInfo)
  }

  // 保存图片
  await download(imgUrl,  `../novelImg/public/novelPic/${updateNovelInfo.id}`, {
    filename: picUrl,
  }).catch(err => {
    console.log(err)
  });

  return { novelData: updateNovelInfo , directoryUrl }
}