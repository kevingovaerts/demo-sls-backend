var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context) => {

    let body, statusCode;
    const requestBody = JSON.parse(event.body);
    const todoId = requestBody.id;
    const todoTitle = requestBody.title;
    const todoCompleted = requestBody.completed;

    try {
        body = await updateTodo();
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

    async function updateTodo() {
        return new Promise(async (resolve, reject) => {

            var params = {
                TableName: process.env.TableName,
                Key: {
                    "id": { 'S': todoId }
                },
                UpdateExpression: "set completed = :c, title = :t",
                ExpressionAttributeValues: {
                    ":c": { 'BOOL': todoCompleted },
                    ":t": { 'S': todoTitle }
                },
                ReturnValues: "UPDATED_NEW"
            };

            dynamodb.updateItem(params, function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log("completed");
                    resolve(data);
                }
            });
        });
    }

};
