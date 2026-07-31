import mongoose from "mongoose";
import dns from "dns";

// Force Node's resolver to use public DNS servers.
// Fixes "querySrv ECONNREFUSED" on Windows, where Node's c-ares
// resolver sometimes can't read the router-assigned DNS config
// even though the OS itself resolves the SRV record fine.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error.message);

    process.exit(1);
  }
};

export default connectDB;