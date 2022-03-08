// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBgX4ZHt0iE-DP5Sqd0_PorOO_Ln2mx2w0',
	authDomain: 'coffee-lingua.firebaseapp.com',
	databaseURL:
		'https://coffee-lingua-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'coffee-lingua',
	storageBucket: 'coffee-lingua.appspot.com',
	messagingSenderId: '741575457',
	appId: '1:741575457:web:447d07992a9e5611b18c60',
	measurementId: 'G-NCFWTQXF29',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export { auth };
