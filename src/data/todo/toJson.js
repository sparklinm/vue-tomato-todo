const fs = require('fs')
fs.readFile('todo.json', function (err, data) {
  if (err) {
    console.log('文件读取失败')
  } else {
    console.log('文件读取成功')

    fs.writeFile('todo1.json', JSON.stringify(eval('(' + data + ')')), function (err) {
      if (err) {
        console.log('文件写入失败')
      } else {
        console.log('文件写入成功')
      }
    })
  }
})