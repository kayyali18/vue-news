import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize Firebase
if (!firebase.app.length) {
  var config = {
    apiKey: 'AIzaSyD_-MD5xNRniFYwX-ofogvRZViz7XJQXoI',
    authDomain: 'the-thinker-news.firebaseapp.com',
    databaseURL: 'https://the-thinker-news.firebaseio.com',
    projectId: 'the-thinker-news',
    storageBucket: 'the-thinker-news.appspot.com',
    messagingSenderId: '122532747384'
  }

  // Init firebase
  firebase.initializeApp(config)

  // Init settings and timestamp by default
  firebase.firestore().settings({})
}

// create reference to firestore module
const db = firebase.firestore()

export default db
