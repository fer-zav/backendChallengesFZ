import {Router} from "express";
import {UserModel} from "../db/models/models.js";

const userEndpoints = Router();

userEndpoints.get('/', async (req, res) => {
    const data = await UserModel.find();
    res.json({ data });
});

userEndpoints.post('/', async (req, res) => {
    console.log("POST /users/");
    console.log(req.body);
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName) {
        console.log('Invalid body fields');
        return res.status(400).json({ msg: 'Invalid fields' });
    }
    const userData = {username, password, email, firstName, lastName};
    const newUser = new UserModel(userData);
    await newUser.save();
    res.json({ data: newUser });
});

export default userEndpoints;