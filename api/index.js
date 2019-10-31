//Requires
//---------------------------------------------
const express = require('express')
const body_parser = require('body-parser')
const request = require('request-promise')
const cheerio = require('cheerio')

//---------------------------------------------

//Initialize express application block
//---------------------------------------------
const app = express()
const PORT = 3002


app.listen(PORT)
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

const scrapeData = async () => {
    const url = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations/results-previous.html'

    let response = await request(
        url,
        {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
            'cache-control': 'max-age=0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        }
    )
    
    let $ = cheerio.load(response)
    const selector = $(".section h3")

    let res = []

    for (let i = 0; i < selector.length; i++) { // dateSelector.length
        const date = selector[i].children[0].data
        
        const programSelector = selector[i].next.next
        try {
            const program = programSelector.children[0].children[0].data
        } catch (e) {
            console.log(date)
            console.log(programSelector)
        }
        
        // text only
        if(programSelector.children[0].type === "text"){

        }
        
        const invitationsSelector = programSelector.next.next.next.next
        try {
            const invitations = invitationsSelector.children[1].data.trim()
        } catch (e) {
            console.log(date)
            console.log(invitationsSelector)
        }

        const minRankSelector = invitationsSelector.next.next
        try {
            const minRank = minRankSelector.children[1].data.trim()
        } catch (e) {
            console.log(date)
            console.log(minRankSelector)
        }

        const roundTimeSelector = minRankSelector.next.next
        const roundTime = roundTimeSelector.children[1].data.trim()

        const minPointsSelector = roundTimeSelector.next.next
        const minPoints = minPointsSelector.children[1].data.trim()

        const tieBreakSelector = minPointsSelector.next.next
        const tieBreak = tieBreakSelector.children[1].data.trim()

        // const round = {
        //     date,
        //     program,
        //     invitations,
        //     minRank,
        //     roundTime,
        //     minPoints,
        //     tieBreak
        // }

        // res.push(round)
    }

    // console.log(res)

}

app.get('/', (req, res) => {
    console.log("it works")
    res.send("It works.")
})

app.get('/getData', (req, res) => {
    const resp = scrapeData()
    // console.log(resp["102"])
    res.send(resp)
})


console.log('Listening on port ' + PORT)
