// ARTICLES PROBLEM
// Find all acticle titles by author name say "epaga", there may be multiple pages in api
// fetch all pages of article and return the output as an array of titles

"use strict";

const fs = require("fs");
const https = require("https");

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";
let currentLine = 0;

process.stdin.on("data", function (inputStdin) {
  inputString += inputStdin;
});

// process.stdin.on("end", function () {
//   inputString = inputString.split("\n");

//   main();
// });

process.on("SIGINT", function () {
  inputString = inputString.split("\n");

  main();
});

function readLine() {
  return inputString[currentLine++];
}

/*
 * Complete the 'getArticleTitles' function below.
 *
 * The function is expected to return a STRING_ARRAY.
 * The function accepts STRING author as parameter.
 *
 * URL for cut and paste:
 * https://jsonmock.hackerrank.com/api/articles?author=<authorName>&page=<num>
 *
 */

async function getArticleTitles(author) {
  const initPage = 1;
  const authorURL = `https://jsonmock.hackerrank.com/api/articles?author=${author}&page=${initPage}`;

  return new Promise((resolve, reject) => {
    https.get(authorURL, (response) => {
      response.setEncoding("utf-8");
      response.on("data", (data) => {
        const parsedData = JSON.parse(data);
        const articleData = parsedData.data;
        const totalPages = parsedData.total_pages;
        const titlesArr = [];

        articleData.forEach((elem) => {
          titlesArr.push(elem.title);
        });

        for (let i = 2; i <= totalPages; i++) {
          const newPage = i;
          const newAuthorURL = `https://jsonmock.hackerrank.com/api/articles?author=${author}&page=${newPage}`;
          https.get(newAuthorURL, (res) => {
            res.setEncoding("utf-8");
            response.on("data", (newData) => {
              const newParsedData = JSON.parse(newData);
              const newArticleData = newParsedData.data;
              newArticleData.forEach((elem) => {
                titlesArr.push(elem.title);
              });
            });
          });
        }
        resolve(titlesArr);
      });
    });
  });
}

async function main() {
  const ws = fs.createWriteStream("./index.txt");

  const author = readLine();

  const result = await getArticleTitles(author);
  console.log(result);

  ws.write(result.join("\n") + "\n");

  ws.end();
}
