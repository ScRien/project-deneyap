import { collection, addDoc } from "firebase/firestore";
import { db } from "./config";

export async function addCustomer(data) {
  try {
    await addDoc(collection(db, "customers"), data);
    alert("Talebiniz gönderildi.");
  } catch (error) {
    console.error("Hata:", error);
    alert("Kayıt sırasında hata oluştu.");
  }
}
