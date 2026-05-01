const { Server } = require("socket.io");

const PORT = 3000;
const io = new Server(PORT, {
    cors: { origin: "*" }
});

let users = {};

console.log(`🔥 Server aktif di port ${PORT}...\n`);

io.on("connection", (socket) => {
    console.log("🔌 Client terhubung:", socket.id);

    socket.on("register", (name) => {
        if (!name) return;

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
