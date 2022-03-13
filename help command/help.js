const { MessageEmbed, Constants } = require("discord.js")
const path = require("path")
const getFiles = require("getfiles") // Imports are incorrect, but if you look in the directory you can find some of them by name
const config = require("config") // You can read to find out what this contains

const commandPath = path.resolve(__dirname, "commands")
const commandFiles = getFiles(commandPath, ".js")



module.exports = {
    name: "help",
    description: "Displays all the commands.",
    syntax: "[command name]",
    registerSlashCommand: true,
    slashOptions: {
        options: [
            {
                type: Constants.ApplicationCommandOptionTypes.STRING,
                name: "commandname",
                description: "The name of the command.",
            },
        ]
    },

    callback: async (message, args) => {
        var categories = {}

        for (const command of commandFiles) {
            let commandFile = require(command)
            if (commandFile.default) commandFile = commandFile.default

            const split = command.replace(/\\/g, '/').split('/')
            const category = split[split.length - 2]

            const commandName = commandFile.name.toLowerCase()

            if (commandName == args[0]) {
                let syntax = commandFile.syntax
                if (syntax.length == 0) syntax = "No arguments required"
                const embed = new MessageEmbed()
                    .setTitle(commandName.charAt(0).toUpperCase() + commandName.slice(1))
                    .setColor("DARK_PURPLE")
                    .setThumbnail(config.customThumbnailImage)
                    .setFooter({
                        text: config.customFooterText
                    })
                    .setTimestamp()
                    .setFields(
                        { name: "Description", value: commandFile.description },
                        { name: "Syntax", value: `\`${syntax}\`` },
                    )
                await message.reply({
                    embeds: [embed]
                })
                return
            }

            var previousString = categories[category]

            if (previousString != null) {
                previousString = previousString.concat(" ", `\`${commandName}\``)
            } else {
                previousString = `\`${commandName}\``
            }

            categories[category] = previousString

        }

        const embed = new MessageEmbed()
            .setTitle("Help")
            .setColor("DARK_PURPLE")
            .setThumbnail(config.customThumbnailImage)
            .setDescription("A list of all the commands associated with this bot.")
            .setFooter({
                text: config.customFooterText
            })
            .setTimestamp()

        for (const category in categories) {
            const string = categories[category];
            embed.addFields(
                {
                    name: category,
                    value: string,
                }
            )
        }

        const support = `[Support Server](${config.mainServerInvite})`

        embed.addField("\u200b", `${support}\n**Use \`rr!help [command name]\` to get information on a specific command.**`)

        await message.reply({
            embeds: [embed]
        })
    }
}