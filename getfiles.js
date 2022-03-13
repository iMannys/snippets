const fs = require("fs")
const path = require("path")

const getFiles = (dir, suffix) => {
    
    const files = fs.readdirSync(dir, {
        withFileTypes: true,
    })

    let Files = []

    for (const file of files) {
        if (file.isDirectory()) {
            Files = [
                ...Files,
                ...getFiles(`${dir}/${file.name}`, suffix),
            ]
        } else if (file.name.endsWith(suffix)) {
            const directory = path.normalize(`${dir}/${file.name}`)
            Files.push(directory)
        }
    }

    return Files
}

module.exports = getFiles