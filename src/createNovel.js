const Novel = require('./model/Novel')
const Roll = require("./model/Roll");
const Chapter = require("./model/Chapter");
const ChapterContent = require('./model/ChapterContent')

module.exports = async (createNovelInfo, novelRoll, novelContent, page) => {
  let index = 0
  // 循环处理小说卷目录
  for (const item of novelRoll) {
    // 创建小说卷目录
    const createNovelRoll = await Roll.create({
      novel_id: createNovelInfo.id,
      novel_name: createNovelInfo.name,
      roll_title: item[0].name
    })
    // 循环处理小说卷章节
    for (const itemName of item) {
      // 判断是否存在链接, 存在链接即表示 循环到目录
      if (itemName.url) {
        const createNovelChapter = await Chapter.create({
          roll_id: createNovelRoll.id,
          novel_id: createNovelInfo.id,
          novel_name: createNovelInfo.name,
          chapter_title: itemName.name
        })
        const createNovelContent = await ChapterContent.create({
          chapter_id: createNovelChapter.id,
          novel_id: createNovelInfo.id,
          novel_name: createNovelInfo.name,
          chapter_title: itemName.name,
          content: novelContent[index].chapter_content,
          pic_content: novelContent[index].chapter_pic ? JSON.stringify(novelContent[index].chapter_pic) : '',
        })
        index++
      }
    }
  }
  console.log(`创建小说成功${createNovelInfo.name}`, page, `id:${createNovelInfo.id}`)
}