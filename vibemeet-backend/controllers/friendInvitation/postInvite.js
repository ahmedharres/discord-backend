const friendInvitation = require('../../models/friendInvitation');
const User = require('../../models/user');
const friendsUpdate = require('../../socketHandler/updates/friends');
const postInvite = async (req, res) => {
    const { targetMailAddress } = req.body;

    const { userId, mail } = req.user;

    if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
        return res
            .status(409)
            .send('Can not be friend to yourself');
    }

    const targetUser = await User.findOne({
        mail: targetMailAddress.toLowerCase()
    });

    if (!targetUser) {
        return res
            .status(404)
            .send(`Friend of ${targetMailAddress} has not been found check mail address`);
    }

    const invitationAlreadyReceived = await friendInvitation.findOne({
        senderId: userId,
        receiverId: targetUser._id,
    });

    if (invitationAlreadyReceived) {
        return res
            .status(409).
            send('Invitation has been already sent');
    }

    const usersAlreadFriends = targetUser.friends.find(friendId =>
        friendId.toString() === userId.toString()
    );
    if (usersAlreadFriends) {
        return res
            .status(409)
            .send('Friend already added. please check your friends list')
    }

    const newInvitation = await friendInvitation.create({
        senderId: userId,
        receiverId: targetUser._id,
    });


    friendsUpdate.updateFriendsPindingInvitations(targetUser._id.toString()); 

    return res.status(201).send('Invitation has been sent');
}

module.exports = postInvite;