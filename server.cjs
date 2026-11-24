"use strict";
const http = require("node:http");
const {readFileSync} = require("node:fs");
const {join} = require("node:path");
const {chapters, runProgram, parseFormula, scopedLine} = require("./proof-language.js");

function diagnose(doc) {
  const match = /^proof:\/\/workshop\/(\d+)-(\d+)$/.exec(doc.uri);
  const stage = match && chapters[match[1]]?.stages[match[2]];
  if (stage?.kind !== "proof" || typeof doc.text !== "string") throw Error("Invalid proof document");
  const initial = {scope: [], lines: stage.given.map((f,i) => scopedLine(parseFormula(f), [], [i+1], "前提"))};
  try {
    runProgram(initial, stage, doc.text);
    return [];
  } catch (error) {
    const [,number,message] = /^(\d+) 行目：([\s\S]*)$/.exec(error.message) || [null,1,error.message];
    const line = Number(number)-1;
    const end = doc.text.split(/\r?\n/)[line]?.length || 0;
    return [{range:{start:{line,character:0},end:{line,character:end}}, severity:1, source:"logic-workshop", message}];
  }
}

function session(messages) {
  if (!Array.isArray(messages) || messages.length>8) throw Error("Invalid session");
  const docs = new Map(), replies = [];
  for (const {id,method,params,jsonrpc} of messages) {
    if (jsonrpc !== "2.0") throw Error("Invalid JSON-RPC");
    let result;
    switch (method) {
      case "initialize": result={capabilities:{textDocumentSync:1,diagnosticProvider:{interFileDependencies:false,workspaceDiagnostics:false}}};break;
      case "initialized": continue;
      case "textDocument/didOpen": docs.set(params.textDocument.uri,params.textDocument);continue;
      case "textDocument/diagnostic": result={kind:"full",items:diagnose(docs.get(params.textDocument.uri))};break;
      default: if(id!==undefined) replies.push({jsonrpc:"2.0",id,error:{code:-32601,message:"Unknown method"}});continue;
    }
    replies.push({jsonrpc:"2.0",id,result});
  }
  return replies;
}

const html=readFileSync(join(__dirname,"index.html"),"utf8").replace('<html lang="ja">','<html lang="ja" data-language-server>');
const engine=readFileSync(join(__dirname,"proof-language.js"));
const server=http.createServer(async(req,res)=>{
  const send=(code,type,body)=>{res.writeHead(code,{"Content-Type":type+"; charset=utf-8","X-Content-Type-Options":"nosniff"});res.end(body);};
  if(req.method==="GET" && ["/","/index.html"].includes(req.url))return send(200,"text/html",html);
  if(req.method==="GET" && req.url==="/proof-language.js")return send(200,"text/javascript",engine);
  if(req.method!=="POST" || req.url!=="/lsp")return send(404,"text/plain","Not found");
  try {
    let size=0;
    const chunks=[];
    for await(const chunk of req){size+=chunk.length;if(size>256*1024)return send(413,"text/plain","Document too large");chunks.push(chunk);}
    send(200,"application/json",JSON.stringify(session(JSON.parse(Buffer.concat(chunks).toString()))));
  } catch {send(400,"text/plain","Invalid proof request");}
});
server.listen(Number(process.env.PORT||8080),"0.0.0.0");
