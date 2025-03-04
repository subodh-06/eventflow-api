import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

// Fix private_key formatting (replace `\n` with actual new lines)
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
