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

        console.clear();
        console.log("📡 DAFTAR USER AKTIF:\n");

        Object.keys(users).forEach((u, i) => {
            console.log(`${i + 1}. ${u}`);
        });

        console.log("\n💡 Ketik /blok nama untuk blok user");
    });

    socket.on("disconnect", () => {
        for (let name in users) {
            if (users[name] === socket.id) {
                delete users[name];

                console.clear();
                console.log("📡 DAFTAR USER AKTIF:\n");

                Object.keys(users).forEach((u, i) => {
                    console.log(`${i + 1}. ${u}`);
                });

                console.log("\n💡 Ketik /blok nama untuk blok user");
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
            delete users[target];

            console.log(`\n⛔ ${target} berhasil diblokir`);
        } else {
            console.log("\n❌ User tidak ditemukan");
        }
    }
});
