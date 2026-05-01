const { Server } = require("socket.io");
const io = new Server(3000);

let users = {};

console.log("🔥 Server aktif di port 3000...\n");

io.on("connection", (socket) => {

    socket.on("register", (name) => {
        users[name] = socket.id;
        console.log(`🟢 User masuk: ${name}`);
    });

    socket.on("disconnect", () => {
        for (let name in users) {
            if (users[name] === socket.id) {
                console.log(`🔴 User keluar: ${name}`);
                delete users[name];
            }
        }
    });
});

// ADMIN COMMAND
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", (input) => {
    if (input.startsWith("/blok ")) {
        let target = input.split(" ")[1];

        if (users[target]) {
            io.to(users[target]).emit("blocked");
            console.log(`⛔ ${target} diblokir`);
            delete users[target];
        } else {
            console.log("❌ User tidak ditemukan");
        }
    }
});
