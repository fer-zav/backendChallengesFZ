import {Router} from "express";
import {UserModel} from "../db/models/models.js";

const userEndpoints = Router();

userEndpoints.get('/', async (req, res) => {
    const data = await UserModel.find();
    res.json({ data });
});

userEndpoints.post('/', async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName) return res.status(400).json({ msg: 'Invalid fields' });
    const userData = {username, password, email, firstName, lastName};
    const newUser = new UserModel(userData);
    await newUser.save();
    res.json({ data: newUser });
});

export default userEndpoints;