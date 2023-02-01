const fs = require("fs");
const util = require("util");

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

const readAndDelete = (id, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      let newList = [];
      let index = getIndex(id, parsedData);

      if (index !== "") {
        newList = parsedData.filter((parsedData) => parsedData.id !== id);
      }
      writeToFile(file, newList);
    }
  });

  const getIndex = (id, data) => {
    let index = "";
    for (i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        index = i;
        break;
      }
    }
    return index;
  };
};

module.exports = { readFromFile, writeToFile, readAndAppend, readAndDelete };
