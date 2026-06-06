const firebaseConfig = {
  apiKey: "AIzaSyB39WPXW-vV25QQiUB5Fkk9di4cUVfpCjo",
  authDomain: "albimo-shopee.firebaseapp.com",
  databaseURL: "https://albimo-shopee-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "albimo-shopee",
  storageBucket: "albimo-shopee.firebasestorage.app",
  messagingSenderId: "349404045321",
  appId: "1:349404045321:web:6d5b49cd1897d4e51418d8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
