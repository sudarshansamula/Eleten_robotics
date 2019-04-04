var config=require('./config.json');
var AWS = require('aws-sdk');
var aws_config=config.aws_config;
var date_config=config.date_config;
AWS.config.region = aws_config.region;
AWS.config.update({
    accessKeyId: aws_config.accessKeyId,
    secretAccessKey: aws_config.secretAccessKey,
});
var s3Client = new AWS.S3();
var params={
  Bucket: aws_config.bucket_name
};
var objectData={};
s3Client.listObjects(params, function(err, data) {
   if (err) console.log(err, err.stack); 
   var allFiles=data.Contents;
   var i=1
   allFiles.forEach(function(index_val,data_idx,eachFile) {
    params["Key"]=eachFile[data_idx]["Key"];
    s3Client.getObject(params, function(err, data) {
      if (err) console.log(err, err.stack);
      params["Key"]=eachFile[data_idx]["Key"];
      objectData[params["Key"]]=data.Body.toString('utf-8'); 
      if(i == allFiles.length)
        preparedata(objectData)
      i++
    });
   });
});
async function preparedata(dataObj){
  //console.log(dataObj)
  var newdata={};
  for(key in dataObj){
    var arrVal=dataObj[key].split('\r\r\n')
    arrVal.pop();
    var firstVal=arrVal[0].split(',')
    newdata[key]={};
    newdata[key][firstVal[0]]=[];
    newdata[key][firstVal[1]]=[];
    for(i in arrVal){
      var eachVal=arrVal[i];
      if(i > 0){
        splittedArr=eachVal.split(',');
        newdata[key][firstVal[0]].push(Number(splittedArr[0].slice(0, -3)));
        newdata[key][firstVal[1]].push(Number(splittedArr[1]));
      }
    }
  }
  //console.log(newdata)
  var timeStamp = Math.round(new Date(date_config.req_date).getTime() / 1000);
  var last24=date_config.last24hours;
  var last24Cummulative=0;
  var timeStampYesterday = timeStamp - (last24 * 3600);
  var timeStampOneweek=timeStamp - (date_config.last7days * 3600);
  var lastOneweekCummulative=0;
  var overAllCummulative=0;
  for(eachkey in newdata){
    for(innerKey in newdata[eachkey]['Painted Time']){
      var paintedstamp=newdata[eachkey]['Painted Time'][innerKey];
      if(paintedstamp <= timeStamp&&paintedstamp >= timeStampYesterday){
        last24Cummulative=last24Cummulative+newdata[eachkey]['Area Painted'][innerKey]
      }else if(paintedstamp <= timeStamp&&paintedstamp >= timeStampOneweek){
        lastOneweekCummulative=lastOneweekCummulative+newdata[eachkey]['Area Painted'][innerKey]
      }else{
        overAllCummulative=overAllCummulative+newdata[eachkey]['Area Painted'][innerKey]
      }
    }
  }
  console.log("last24Cummulative ",last24Cummulative," sqft ","lastOneweekCummulative ",lastOneweekCummulative," sqft ","overAllCummulative ",overAllCummulative," sqft");
};

