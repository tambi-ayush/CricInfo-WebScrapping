let fs = require("fs");
let path = require("path");
let req = require('request');
let cheerio = require("cheerio");


function singleMatchAnalysis(url) {
    req(url, cb);
    function cb(err, response, html) {
        if (err)
            console.log("error h score vaal me line 11");
        else if (response.statusCode == 404)
            console.log("page not found");
        else {
            dataExtract(html);
        }
    }
    function dataExtract(html) {
        let searchTool = cheerio.load(html);
        let teams = searchTool(".name-link");//finding both team names
        let scoreTables = searchTool(".table.batsman tbody");//finding batting table array of both teams
        for (let i = 0; i < teams.length; i++) {
            let rows = searchTool(scoreTables[i]).find('tr');
            for (let j = 0; j < rows.length; j++) {
                let data = searchTool(rows[j]).find('td');
                if (data.length == 8) {
                    currentPath = process.cwd();
                    iplPath = path.join(currentPath, "IPL");//creating IPL folder
                    if (fs.existsSync(iplPath) == false)
                        fs.mkdirSync(iplPath);
                    let teamPath = path.join(iplPath, searchTool(teams[i]).text());
                    if (fs.existsSync(teamPath) == false)
                        fs.mkdirSync(teamPath);
                    playerFile = path.join(teamPath, searchTool(data[0]).text() + ".json");
                    let playerName = searchTool(data[0]).text();//getting player name
                    if (fs.existsSync(playerFile) == false) {//if first file making then make empty array
                        let emp = {
                            [playerName]: []
                        };
                        fs.writeFileSync(playerFile, JSON.stringify(emp));
                    }
                    let opponent= i==0?searchTool(teams[1]).text():searchTool(teams[0]).text();//choosing ooponent team
                    let obj={//creating js object to push in json file
                        opponent_Team:opponent,
                        Runs:searchTool(data[2]).text(),
                        Balls:searchTool(data[3]).text(),
                        Fours:searchTool(data[5]).text(),
                        Sixes:searchTool(data[6]).text(),
                        Strike_Rate:searchTool(data[7]).text()
                    };
                    
                    let content=fs.readFileSync(playerFile);
                    jsoncontent=JSON.parse(content);
                    jsoncontent[playerName].push(obj);
                   // console.log(JSON.stringify(jsoncontent));
                    fs.writeFileSync(playerFile,JSON.stringify(jsoncontent));//pushed into the json file
                }

            }
        }
    }
}
module.exports = {
    fxn: singleMatchAnalysis
}