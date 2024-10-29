const http = require("http");
const fs = require("fs"); // // test
// fs.appendFile("test.txt", "Hello", (error) => {
//   if (error) console.log(error);
//   console.log("done!");
// });
// fs.readFile("test.txt", "utf8", (error, data) => {
//   if (error) console.log(error);
//   console.log(data);
// });
// fs.unlink("test.txt", (error) => {
//   if (error) console.log(error);
// });
// // second
// fs.appendFile("second.txt", "Second", (error) => {
//   if (error) console.log(error);
//   console.log("done!");
// });

// fs.readFile("second.txt", "utf8", (error, data) => {
//   if (error) console.log(error);
//   console.log(data);
// });

// fs.unlink("second.txt", (error) => {
//   if (error) console.log(error);
// });
//application/json

// const server = http.createServer((req, res) => {
//   const url = req.url;
//   if (url === "/users") {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/html");
//     fs.readFile("index.html", "utf8", (err, data) => {
//       res.write(data);
//       res.end();
//     });
//   }
// });
// server.listen(8080, console.log("your service is running in PORT:8080"));
let data;
const JSON_DATA = fs.readFileSync("data.json");
data = JSON.parse(JSON_DATA);
const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;
  res.setHeader("Content-Type", "application/json");
  if (method === "GET") {
    if (url.startsWith("/users?id=")) {
      const id = url.split("=")[1];
      const user = data.find((user1) => user1.id === Number(id));
      if (user) {
        res.statusCode = 200;
        res.write(JSON.stringify(user));
      } else {
        res.write(JSON.stringify({ message: "not found" }));
      }
    } else if (url.startsWith("/users")) {
      res.statusCode = 200;
      res.write(JSON.stringify(data));
    } else {
      res.write(JSON.stringify({ message: "not found" }));
    }
    res.end();
  }
  if (method === "POST") {
    let body = "";
    req.on("data", (buffer) => {
      body += buffer;
    });
    req.on("end", () => {
      const parsedData = JSON.parse(body);
      const newUser = {
        ...parsedData,
      };
      data.push(newUser);
      fs.writeFileSync("data.json", JSON.stringify(data), (err) => {
        console.log(err);
      });
      res.write(JSON.stringify({ message: "done" }));
      res.end();
    });
  }
  if (method === "DELETE") {
    let body = "";
    req.on("data", (buffer) => {
      body += buffer;
    });
    req.on("end", () => {
      const jsonId = JSON.parse(body);
      const newData = data.filter((user2) =>
        Number(user2.id) !== Number(jsonId.id) ? user2 : null
      );
      data = newData;
      fs.writeFileSync("data.json", JSON.stringify(data), (err) => {
        console.log(err);
      });
      res.write(JSON.stringify({ message: "done" }));
      res.end();
    });
  }
});
server.listen(8080, console.log("your service is running in PORT:8080"));
