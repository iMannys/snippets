import { ActivitiesOptions } from 'discord.js'

// client = discord client
// botsettings is a JSON file and you can read what it contains

client.once("ready", async () => {
    console.log("Bot is ready!")

    let statuses: ActivitiesOptions[] = [
        {
            name: `${client.guilds.cache.size} servers!`,
            type: "LISTENING"
        },
        {
            name: `${client.users.cache.size} users!`,
            type: "WATCHING"
        },
        {
            name: `${botsettings.prefix}help`,
            type: "LISTENING"
        }
    ]

    let pointer = 0

    setInterval(() => {
        let status: ActivitiesOptions = statuses[pointer]

        if (!status) {
            status = statuses[0]
            pointer = 0
        }

        client.user?.setPresence(
            {
                activities: [status]
            }
        )
        pointer++
    }, 15000)
})