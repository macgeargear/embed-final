import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAi8nMriXzIoeAvu3FSxx5Rtmq46R4PWOA",
  databaseURL:
    "https://embedded-project-group28-e4418-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "embedded-project-group28-e4418",
  projectNumber: "204676097215",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export async function fetchData() {
  const db = getDatabase();
  const humidityRef = ref(db, "test");
  const snapshot = await get(humidityRef);
  return snapshot.val();
}

export async function getData() {
  const data = await fetchData();
  return data;
}
