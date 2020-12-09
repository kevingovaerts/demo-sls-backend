var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context) => {

  return await getAllTodos();

  async function getAllTodos() {
    return new Promise((resolve, reject) => {
      let params = {
        TableName: process.env.TableName
      };
      let todos = [];
      let response = {
        "statusCode": 0,
        "headers": {
          "Access-Control-Allow-Origin": "*"
        },
        "body": "",
        "isBase64Encoded": false
      };

      try {
        dynamodb.scan(params, (err, data) => {
          if (err) {
            console.log('An error occured while trying to scan DynamoDB: ' + err);
          } else {
            for (const todo of data.Items) {
              const id = todo.id['S'];
              const title = todo.title['S'];
              const completed = todo.completed['BOOL'];
              const formattedTodo = {
                "id": id,
                "title": title,
                "completed": completed
              };
              todos.push(formattedTodo);
            }
            response.statusCode = 200;
            response.body = JSON.stringify(todos);
            resolve(response);
          }
        });
      } catch (err) {
        response.statusCode = 400;
        response.body = JSON.stringify(err);
        reject(response);
      }
    });
  }
};
