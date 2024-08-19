const cheerio = require("cheerio");

module.exports = async (page, list, id) => {
  let chapterData = []
  const imgPromise = []
  // 循环处理小说目录
  for (const item of list) {
    // 循环处理小说内容即插图
    for (const data of item) {
      // 判断url是否存在
      if (data.url) {
        await page.goto(data.url, {
          timeout: 0
        })
        // 等待元素出现
        await page.waitForSelector('#content', {
          timeout: 0
        })

        let chapter_content = '' // 章节内容
        let chapter_pic = '' // 章节图片

        // 判断是否存在图片
        chapter_pic = ''
        chapter_content = await getContent() // 获取小说内容
        chapterData.push({ chapter_content, chapter_pic })
      }
    }
  }

  return chapterData
  // 处理小说内容
  async function getContent() {
    const content = await page.$eval('#content', element => element.innerText)
    return JSON.stringify(content.split('\n').filter(el => {
      return el !== null && el !== '';
    }))
  }
}