const userModels = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const accessTokenSecret = "tokenKelompok-2";

module.exports = {
  getAll: async (req, res) => {
    const users = await userModels.find({}, "-_v");
    console.log("users");

    try {
      res.json({
        massage: "berhasil ambil data user",
        data: users,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  getByID: async (req, res) => {
    const users = await userModels.findById(req.params.id);
    try {
      res.json({
        message: "berhasil ambil data user",
        data: users,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  addUser: async (req, res) => {
    const data = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);
    data.password = hash;

    try {
      await userModels.create(data);
      res.json({
        message: "berhasil input data",
        data: 1,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  //Login
  addUserLogin: async (req, res) => {
    const { email, password } = req.body;

    const user = await userModels.findOne({ email: email });
    console.log(user);
    const unHAsh = bcrypt.compareSync(password, user.password);

    try {
      if (user && unHAsh) {
        const accessToken = jwt.sign({ email: user.email }, accessTokenSecret);

        res.json({
          accessToken,
        });
      } else {
        res.send("Email atau password salah");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },

  // update
  updateUser: async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
      await userModels.findByIdAndUpdate(id, data);
      res.json({
        massage: `User ${id} data updated`,
        data: data,
      });
    } catch (eror) {
      res.status(500).send(eror);
    }
  },

  // delete
  deleteUser: async (req, res) => {
    const id = req.params.id;
    await userModels.deleteOne({ _id: req.params.id });
    try {
      res.json({
        massage: `Success delete data ${id}`,
      });
    } catch (eror) {
      res.status(500).send(eror);
    }
  },
};