const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");
const friendInvitationController = require('../controllers/friendInvitation/friendInvitationController');

const postFriendInvitationSchema = Joi.object({
    targetMailAddress: Joi.string().email(),
});

const inviteDeisionSchema = Joi.object({
    id:Joi.string().required(),
});

router.post('/invite',
    auth,
    validator.body(postFriendInvitationSchema),
    friendInvitationController.controllers.postInvite
);


router.post('/accept',
    auth,
    validator.body(inviteDeisionSchema),
    friendInvitationController.controllers.postAccept

);


router.post('/reject',
auth,
validator.body(inviteDeisionSchema),
friendInvitationController.controllers.postReject
)

module.exports = router;