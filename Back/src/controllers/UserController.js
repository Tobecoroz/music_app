import userModel from "../models/userModel.js";


const userController = {
    getAllUsers: async(req, res) => {
        try {
            const users = await userModel.getAllUsers();
            console.log('Fetched users:', users);
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getUserById: async(req, res) => {
        const { id } = req.params;
        console.log("params", req.params);
        try {
            const user = await userModel.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default userController;