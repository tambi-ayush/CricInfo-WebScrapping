let fs = require("fs");
let path = require("path");
let request = require('request');
let cheerio = require("cheerio");
let smatchobj=require("./score.js");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url, cb);
function cb(err, response, html) {
    if (err)
        console.log("you have commied url error");
    else if (response.statusCode == 404)
        console.log("page not found");
    else
        allMatch(html);
}
function allMatch(html) {
    let searchTool = cheerio.load(html);
    let className = searchTool(".widget-items.cta-link")
    let aElem = searchTool(className).find('a');
    let link = aElem.attr('href');
    let fullLink = `https://www.espncricinfo.com${link}`;
    request(fullLink, cb2);
}

function cb2(err, response, html) {
    if (err)
        console.log("error hai line 27");
    else if (response.statusCode == 404)
        console.log("page not found");
    else
        getAllScorecard(html);
}
function getAllScorecard(html) {
    let searchTool = cheerio.load(html);
    let aElem = searchTool('a[data-hover="Scorecard"]');
    for(let i=0;i<aElem.length;i++){
    let link = searchTool(aElem[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com"+link;
    //console.log(fullLink);
    smatchobj.fxn(fullLink);
    }
}

// function cb3(err, response, html) {
//     if (err)
//         console.log(err);
//     else if (response.statusCode == 404)
//         console.log("page not found");
//     else{
//         getData(html);
//     }
// }

// function getData(html){
//     let searchTool=cheerio.load(html);
//     let teams=searchTool(".name-link");
//     let team1=searchTool(teams[0]).text();
//     let team2=searchTool(teams[1]).text();
//     console.log(team1+" vs "+team2);
// }