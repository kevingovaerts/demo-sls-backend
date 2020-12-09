var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context) => {

    let body, statusCode, returnData;
    console.log("EVENT : " + JSON.stringify(event));
    const awsReqId = context.awsRequestId;
    const requestBody = JSON.parse(event.body);
    const todoTitle = requestBody.title;
    const todoCompleted = requestBody.completed;

    try {
        returnData = await saveTodo();
        body = {
            id: returnData.id['S'],
            title: returnData.title['S'],
            completed: returnData.completed['BOOL']
        };
        statusCode = 200;

    } catch (e) {
        body = { error: e.message };
        statusCode = 500;
    }

    return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
    };

    async function saveTodo() {
        return new Promise(async (resolve, reject) => {

            var params = {
                Item: {
                    "id": {
                        S: `${awsReqId}`
                    },
                    "title": {
                        S: `${todoTitle}`
                    },
                    "completed": {
                        BOOL: todoCompleted
                    }
                },
                ReturnConsumedCapacity: "TOTAL",
                TableName: process.env.TableName
            };

            dynamodb.putItem(params, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log("completed");
                    resolve(params.Item);
                }
            });
        });
    }

};
