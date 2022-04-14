'use strict';

const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require("fs");
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.options('*', cors()); // include before other routes
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
//routes routes
app.post("/setHolders",(req,res)=>{
    let data = JSON.stringify({data:req.body});
    fs.writeFileSync('holderList.json', data);
    res.send({staus:'OK'});
});
app.post("/getHolders",(req,res)=>{    
    fs.readFile('holderList.json', (err, data) => {
        if (err) throw err;
        let holders = JSON.parse(data);
        var flgUser = false;
        for(var idx = 0; idx< holders.data.length; idx ++) {
            if(holders.data[idx].id.toLowerCase() == req.body.userAddress.toLowerCase()){
                flgUser = true;
                break;
            }
        }
        res.send({holders: holders.data.length, flgClaim: flgUser});
    });
}) 
app.listen(5000,()=>{
    console.log("Server started on 5000 port")
})