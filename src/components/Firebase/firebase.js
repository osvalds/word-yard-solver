import app from "firebase/app";
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyBJvPrZxYhecP4gosK53YCYSJftXhvvFNA",
    authDomain: "shaq-ce7aa.firebaseapp.com",
    databaseURL: "https://shaq-ce7aa.firebaseio.com",
    projectId: "shaq-ce7aa",
    storageBucket: "shaq-ce7aa.appspot.com",
    messagingSenderId: "187768776415",
    appId: "1:187768776415:web:3c1e24ce40b9c0afb2eb6a",
};

class Firebase {
    constructor() {
        app.initializeApp(config)
        this.db = app.firestore()
    }
}

export default Firebase
