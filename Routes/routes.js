const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const MongoSchema = require("../Models/medSchema");
const router = express.Router();
var Readable = require("stream").Readable;

function bufferToStream(buffer) {
  var stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}
// Multer storage engine
var multerStorage = multer.memoryStorage();
// var multerStorage = multer.diskStorage({
//     destination:(req,file,cb)=>
//         cb(null,"./uploads"),
//     filename:(req,file,cb)=>cb(null,Date.now()+'--'+file.originalname)
// });
const upload = multer({ storage: multerStorage });

router.post("/uploadCSV", upload.single("file"), (req, res) => {
  // console.log(req.file);
  data = [];
  bufferToStream(req.file.buffer)
    .on("error", () => {
      res
        .status(400)
        .send({ status: false, msg: "error while reading csv file" });
    })
    .pipe(csv())
    .on("data", (row) => {
      data.push(row);
      console.log(data.length);
    })
    .on("end", async () => {
      // handle end of CSV
      try {
        await MongoSchema.create(data);
      } catch (error) {
        res
          .status(500)
          .send({ status: false, msg: "error while inserting data to db." });
      }
      res.send({ status: true, msg: "success" });
    });
});

router.get("/GetAll", async (req, res) => {
  var pageNumber = req.query["pageNumber"] ?? 1;
  var pageSize = req.query["pageSize"] ?? 10;
  console.log(pageSize);
  try {
    var dbData = await MongoSchema.paginate(
      {},
      { offset: pageNumber, limit: pageSize ,customLabels:{totalDocs:'count'}}
    )
      // .sort({ d_created_on: -1 })
    console.log(dbData);
  } catch {
    res
      .status(500)
      .send({ status: false, msg: "error while fetching from db." });
  }
  var resData = {
    data: dbData,
  };
  res.send({ success: true, msg: "success", data: resData });
});

module.exports = router;
