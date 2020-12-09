var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context) => {

    let body, statusCode, returnData;
    console.log("EVENT : " + JSON.stringify(event));

    const requestBody = JSON.parse(event.body);
    const deleteId = requestBody.id;

    try {
        returnData = await deleteTodo();
        body = { returnData };
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

    async function deleteTodo() {
        return new Promise(async (resolve, reject) => {

            var params = {
                Key: {
                    "id": {
                        S: `${deleteId}`
                    }
                },
                TableName: process.env.TableName
            };

            dynamodb.deleteItem(params, function (err, data) {
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
