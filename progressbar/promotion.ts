const fields = 30 // how many fields that are in the progressbar. For example: [##########__________] (20 fields)
const achievedOperator = "#"
const missingOperator = "\\_" // prevent discord formatting

const progressBar = (xp: number, nextXP: number): { progressString: string, percentage: number } => {
    if (xp === 0) xp = 1
    let percentage = xp / nextXP * 100
    if (percentage === Infinity) percentage = 0 // Dividing by 0 yields infinity
    percentage = Math.floor(percentage)

    let achievedFields = Math.floor(percentage * (fields / 100))
    let missingFields = fields - achievedFields
    
    let progressString = "["
    
    if (achievedFields > 0) {
        for (let i = 0; i < achievedFields; i++) {
            progressString = progressString.concat(achievedOperator)
        }
    }

    for (let i = 0; i < missingFields; i++) {
        progressString = progressString.concat(missingOperator)
    }

    progressString = progressString.concat("]")

    return { progressString: progressString, percentage: percentage }
}

export default { progressBar }