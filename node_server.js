var bucket_name='eternalroboticssudarshan';
var accessKeyId='AKIAJUO3XXR4YI4O65LQ';
var secretAccessKey='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';
var AWS = require('aws-sdk');
AWS.config.region = 'ap-south-1';
AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});
var s3Client = new AWS.S3();
var params={
  Bucket: bucket_name
};
var ts = Math.round(new Date().getTime() / 1000);
var tsYesterday = ts - (168 * 3600);
//console.log(new Date(),"=====",tsYesterday,ts)
var objectData={};
s3Client.listObjects(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
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
  var timeStamp = Math.round(new Date('03.05.2019 01:26').getTime() / 1000);
  var last24=24;
  var last24Cummulative=0;
  var timeStampYesterday = timeStamp - (last24 * 3600);
  var timeStampOneweek=timeStamp - (168 * 3600);
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
/*
var objectData={}
var params = {
  Bucket: bucket_name,
  Key: "day1.csv"
 };
s3Client.getObject(params, function(err, data) {
   if (err) console.log(err, err.stack);
   objectData["day1.csv"]=data.Body.toString('utf-8'); 
});
params["Key"]='day7.csv';
s3Client.getObject(params, function(err, data) {
  if (err) console.log(err, err.stack);
  objectData["day7.csv"]=data.Body.toString('utf-8'); 
});
params["Key"]='day30.csv';
s3Client.getObject(params, function(err, data) {
  if (err) console.log(err, err.stack);
  objectData['day30.csv']=data.Body.toString('utf-8'); 
  console.log(objectData)
});*/

/*s3Client.getBucketAcl(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else    console.log("bucket ACL",data);          // successful response
});*/

/*s3Client.upload(params, function (err, data) {
if (err) {
    console.log("Error creating the folder: ", err);
    } else {
    console.log("Successfully created a folder  on S3 and file on s3");

    }
});*/
//-----------------
//To check weather object or folder existing or not in s3
/*var params = {
  Bucket: "sudarshantest",
  Key: "folderInBucket/sample.txt"
 };
 s3Client.getObject(params, function(err, data) {
   if (err) console.log(err, err.stack);
   else     console.log("no_err",data);
 });*/
 //------------------------
 //To get access per missions
/* var params = {
   Bucket: "sudarshantest",
   Key: "folderInBucket/"
  };
  s3Client.getObjectAcl(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log("get object acl",data);
  });*/
  //------------------
//To knwo bucketExists or not in s3 storage system
/*  var params = {
  Bucket: 'sudarshantest'
};
s3Client.waitFor('bucketExists', params, function(err, data) {
  if (err) console.log(err, err.stack);
  else     console.log("bucketExists",data);
});*/
//---------------
//excecution of python script using child processor
/*var spawn = require('child_process').spawn,
    py    = spawn('python', ['compute_input.py']),
    data = [1,2,3,4,5,6,7,8,9],
    dataString = '';
py.stdout.on('data', function(data){
  dataString += data.toString();
});
py.stdout.on('end', function(){
  console.log('Sum of numbers=',dataString);
});
py.stdin.write(JSON.stringify(data));
py.stdin.end(); */
/*
var params = {
  localFile: "compared_file.csv",
  s3Params: {
    Bucket: "sudarshantest",
    Key: "compared_file.csv"
  },
};
var d_params = {
  localFile: "package.json",
  s3Params: {
    Bucket: "sudarshantest",
    Key: "package.json"
  },
};
//Pulling a files from s3 bucket
var downloader = client.downloadFile(d_params);
downloader.on('error', function(err) {
  console.error("unable to download:", err.stack);
});
downloader.on('progress', function() {
  console.log("progress", downloader.progressAmount, downloader.progressTotal);
});
downloader.on('end', function() {
  console.log("done downloading");
});
//----------------------Up load file to s3 bucket
var uploader = client.uploadFile(params);
uploader.on('error', function(err) {
  console.error("unable to upload:", err.stack);
});
uploader.on('progress', function() {
  console.log("progress", uploader.progressMd5Amount,
            uploader.progressAmount, uploader.progressTotal);
});
uploader.on('end', function() {
  console.log("done uploading");
});*/
/*var params = {
  ExecutionRoleArn: 'arn:aws:iam::600053779239:role/service-role/AmazonSageMaker-ExecutionRole-20180125T205691', 
  ModelName: 'throughnode', 
  PrimaryContainer: { 
    Image: '600053779239.dkr.ecr.us-east-1.amazonaws.com/decision-trees-sample', 
    ModelDataUrl: 's3://sudarshantest/model.tar.gz'
  }
};
sagemaker.createModel(params, function(err, data) {
  if (err) console.log("errr",err, err.stack); // an error occurred
  else     console.log("data***",data);           // successful response
});*/
/*var params = {
  EndpointConfigName: 'newendpoint',
  EndpointName: 'newendpointinvoked', 

};
sagemaker.createEndpoint(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else{console.log("data****",data)}
});*/
/*var params = {
  EndpointConfigName: 'newendpoint', 
ProductionVariants: [
    {
      InitialInstanceCount: 1,
      InstanceType: "ml.t2.medium",
      ModelName: 'throughnode', 
      VariantName: 'AllTraffic', 
      InitialVariantWeight: 1
    }]
};
sagemaker.createEndpointConfig(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log("created end point",data);           // successful response
});*/

/*var params = {
  NameContains: 'newendpointinvoked'
};
sagemaker.listEndpoints(params, function(err, data) {
  if (err) console.log(err, err.stack);
  else     console.log("console.log",data);
});*/
//glue job running example
/*var params = {
  Command: { 
    Name: 'glueetl',
    ScriptLocation: "s3://sudarshantest/mytestwithnode.scala"
  },
  Name: 'mytestwithnode1', 
  Role: "AWSGlueServiceRole_LS", 
  DefaultArguments: {"--TempDir":"s3://sudarshantest/mytestwithnode/","database":"MSSQL",
                                              "--job-bookmark-option":"job-bookmark-disable",
                                               "--job-language":"scala",
                                               "--class":"GlueApp"}
};
glue.createJob(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log("created glue job ",data)
});
params={"JobName": "mytestwithnode1"}
glue.startJobRun(params,function(err,data){
                    console.log(err,data)
                });

var server=http.createServer((function(request,response)
{
	response.writeHead(200, {'Content-Type': "text/html"});
	response.end("Hello World\n");
}));
server.listen(7000);*/

