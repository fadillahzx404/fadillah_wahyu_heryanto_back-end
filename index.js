const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const app = express();
const PORT = 8000;

// SET BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// LISTEREN
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));

// API

//GET ALL Barang
app.get("/api/barang", (req, res) => {
  const querySql =
    "SELECT *, kategori.nama_kategori FROM barang INNER JOIN kategori ON barang.kategori_id=kategori.id";
  db.query(querySql, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Ada kesalahan", error: err });
    }
    res.status(200).json(rows);
  });
});
//GET ALL Kategori
app.get("/api/kategori", (req, res) => {
  const querySql = "SELECT * FROM kategori";
  db.query(querySql, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Ada kesalahan", error: err });
    }
    res.status(200).json(rows);
  });
});

// ADD DATA
app.post("/api/tambah_barang", (req, res) => {
  const data = { ...req.body };
  const querySql = "INSERT INTO barang SET ?";

  db.query(querySql, data, (err, result, field) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal insert data!", error: err });
    }

    // jika request berhasil
    res.status(201).json({ success: true, idB: `${result.insertId}` });
  });
});

// UPDATE DATA
app.put("/api/edit_barang/:id", (req, res) => {
  let barangId = req.params.id;

  const data = { ...req.body };

  const querySql = "UPDATE barang  SET ? WHERE id=" + barangId;
  db.query(querySql, data, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal Update data!", error: err });
    }

    // jika request berhasil
    res.status(201).json({ success: true, message: "Berhasil Update data!" });
  });
});

// DELETE DATA
app.delete("/api/hapus_barang/:id", (req, res) => {
  const barangId = req.params.id;

  const querySql = "DELETE FROM barang WHERE id=" + barangId;
  db.query(querySql, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal Hapus Barang!", error: err });
    }

    // jika request berhasil
    res.status(201).json({ success: true, message: "Berhasil Hapus Barang!" });
  });
});

// DELETED ALL DATA
app.delete("/api/all_barang", (req, res) => {
  const querySql = "TRUNCATE TABLE `barang`";
  db.query(querySql, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal Hapus Barang!", error: err });
    }

    // jika request berhasil
    res
      .status(201)
      .json({ success: true, message: "Berhasil Hapus Semua Barang!" });
  });
});
// DELETE DATA BY SELECTED

app.delete("/api/hapus_barang/selected/:array", (req, res) => {
  let array = req.params.array;

  const barangIdList = array.replace("[", "(").replace("]", ")");

  const querySql = "DELETE FROM barang WHERE id IN " + barangIdList;
  db.query(querySql, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Gagal Hapus Barang!", error: err });
    }

    // jika request berhasil
    res
      .status(201)
      .json({ success: true, message: "Berhasil Hapus Barang Yang Di Pilih!" });
  });
});
