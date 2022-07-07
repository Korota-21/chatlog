const chats = {};

function SocketRouter(socket, io) {
    let CurrentChat;
    let addedUser = false;

    socket.on("JoinChat", newChatId => {
        socket.leave(CurrentChat);
        // this variable for printing becouse socket.join take time so it works after changing the previousId value
        let p = CurrentChat
        socket.join(newChatId, () => console.log(`Socket ${socket.user.name} joined room ${newChatId} and left room ${p}`));
        CurrentChat = newChatId;
        console.log(socket.rooms);
    });

    socket.on('adduser', (user) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.user = user;

        addedUser = true;
    });

    socket.on("addChat", chat => {
        chats[chat._id] = chat;
    });
    socket.on("newMessage", (message) => {
        socket.broadcast.emit('newMessage', message);
        console.log("new message received");
    })
    socket.on("getAllChat", chat => {

        console.log(chats);
    });
    io.emit("noUser");


    console.log(`Socket ${socket.id} has connected`);

}

module.exports = SocketRouter;