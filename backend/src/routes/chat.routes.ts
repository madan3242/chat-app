import express from "express";
import {
  createOrAccessChat,
  //   addUserToGroup,
  //   fetchAllChats,
    // createGroupChat,
//   removeUserFromGroup,
//   renameGroupChat,
} from "../controllers/chat.controllers";
import { isLoggedIn } from "../middlewares/auth.middlewares";

const router = express.Router();

router.route('/')
        .post(isLoggedIn,createOrAccessChat)
//         .get(isLoggedIn ,fetchAllChats);

// router.route('/group').post(isLoggedIn, createGroupChat);
// router.route('/group/rename').post(isLoggedIn, renameGroupChat);
// router.route('/group/add').put(isLoggedIn, addUserToGroup);
// router.route('/group/remove').put(isLoggedIn, removeUserFromGroup);

export default router;