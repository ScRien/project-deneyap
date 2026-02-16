import { getAuth } from "firebase/auth";

const auth = getAuth();
auth.appVerificationDisabledForTesting = true; // Test modunu aktif et

export { auth };
