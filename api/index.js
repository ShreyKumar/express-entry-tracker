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
        let program = null

        // text only
        if(programSelector.children[0].type === "text"){
            const txt = programSelector.children[0].data
            program = []
            if(txt.includes('Federal Skilled Trades Program')){
                program.push('Federal Skilled Trades Program')
            }

            if(txt.includes('Federal Skilled Workers Program')){
                program.push('Federal Skilled Workers Program')
            }

            if(txt.includes('Canadian Experience Class')){
                program.push('Canadian Experience Class')
            }

            if(txt.includes('Provincial Nominee Program')) {
                program.push('Provincial Nominee Program')
            }
        } else {
            program = programSelector.children[0].children[0].data
        }
        
        const invitationsSelector = programSelector.next.next.next.next
        let invitations = null
        let minRank = null

        if (invitationsSelector.name === "table") {
            const details = invitationsSelector.children[3].children[1].children
            invitations = parseInt(details[1].children[0].data)
            minRank = parseInt(details[3].children[0].data)
        } else if (invitationsSelector.children[0].name === 'a') {
            console.log(invitationsSelector.next.next.children[0])
            const nxtProgram = invitationsSelector.next.next.children[0].data
            if(nxtProgram.includes('Federal Skilled Trades Program')){
                program = 'Federal Skilled Trades Program'
            }
        } else {
            try {
                invitations = invitationsSelector.children[1].data.trim()
            } catch (e) {
                // console.log(date)
                // console.log(invitationsSelector)
            }
        }

        const minRankSelector = invitationsSelector.next.next
        try {
            minRank = minRankSelector.children[1].data.trim()
        } catch (e) {
            // console.log(date)
            // console.log(minRankSelector)
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
