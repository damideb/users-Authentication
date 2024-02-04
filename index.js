import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {    getAuth,
            createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            onAuthStateChanged,
            signOut
        } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
 import { getFirestore, doc, getDoc, collection, addDoc,setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';


const firebaseConfig = {
  apiKey: "AIzaSyCHhWPDed3Qtmwz-YMm80aP9HxPQ6l6YRk",
  authDomain: "user-auth-6835e.firebaseapp.com",
  projectId: "user-auth-6835e",
  storageBucket: "user-auth-6835e.appspot.com",
  messagingSenderId: "206072433838",
  appId: "1:206072433838:web:baa9428a3568ff30cb713f",
  measurementId: "G-QVP0BBB7WC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore()

const guideList = document.querySelector('.guides')
const userEmail = document.querySelector("#userEmail");
const userPassword = document.querySelector("#userPassword");
const authForm = document.querySelector("#authForm")
const secretContent = document.querySelector("#secretContent")
const signUpButton = document.querySelector("#signUpButton")
const signInButton = document.querySelector("#signInButton")
const signOutButton = document.querySelector("#signOutButton")
const createForm = document.querySelector('#create-form')
const accountDetails = document.querySelector('.account-details')
const bio = document.querySelector("#signup-bio")
const name = document.querySelector('#name')

secretContent.style.display ="none"

// sign up
const userSignUp =   async()=>{

    const signUpEmail = userEmail.value
    const signUpPassword = userPassword.value

    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential)=>{
        const user = userCredential.user;
        setDoc(doc(db, 'users', user.uid), {
            bio:bio.value,
            name: name.value
        })
        
        alert("You have created an account successfully")
    })
    
    await setDoc(doc(db, "cities", "LA"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
      })

    .catch((error)=>{
        const errorCode = error.code
        const errorMessage = error.errorMessage
        console.log(errorCode + errorMessage)
    })
   
}

signUpButton.addEventListener("click", userSignUp)

const userSignIn =  async()=>{
    const signInEmail = userEmail.value
    const signInPassword = userPassword.value
    signInWithEmailAndPassword(auth, signInEmail, signInPassword)
    .then((userCredential)=>{
        const user = userCredential.user;
        alert("you have signed in successfully")
    })
    .catch((error)=>{
        const errorCode = error.code
        const errorMessage = error.errorMessage
        console.log(errorCode + errorMessage)
    })
}

const checkAuthState = async()=>{
    onAuthStateChanged(auth, user =>{
        if(user){
           setUpUi(user)
            // getting data. cons- doesnt listen to realtime update/changes
            // getDocs(collection(db, 'guides'))
            // .then(snapshot=>{
            // setUpGuides(snapshot.docs)
            // })
             onSnapshot(collection(db, 'guides'),
            (snapshot)=>{
            setUpGuides(snapshot.docs)
            }, err=>{
                console.log(err.message)
            })            
        }
        else{
            setUpUi()
            setUpGuides([])
        }
    })
}
checkAuthState();

const userSignOut = async()=>{
    await signOut(auth)
}



signInButton.addEventListener("click", userSignIn)
signOutButton.addEventListener("click", userSignOut)

// get data

const setUpGuides = (data)=>{
  if(data.length){
    let html = '';
    data.forEach(doc=>{
        const guide = doc.data();
        console.log(guide)
        const li =`
        <li>
        <div>${guide.title}</div>
        <div>${guide.content}</div>
        </li>
        `
        html+=li
    })
    guideList.innerHTML = html
  }  
  else{
    guideList.innerHTML = '<h4>sign in to view guides</h4>'
  }
  
}

const setUpUi = (user)=>{
   
    if(user){
        getDoc(doc(db, 'users', user.uid))
        .then((doc)=>{
            const html = `<div>logged in as ${doc.data().name}</div>
            <div> ${doc.data().bio}</div>
            `;

            accountDetails.innerHTML = html
        })
       

       authForm.style.display= "none"
       secretContent.style.display ="block"
       accountDetails.style.display= 'block'
    }
    else{
        authForm.style.display= "block"
        secretContent.style.display ="none"
        accountDetails.style.display= 'none'
    }
}
createForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    addDoc(collection(db, 'guides'),{
        title: createForm.title.value,
        content: createForm.content.value,
    }).then(()=>{
        console.log('sent')  
    })
    .then(()=>{
        createForm.title.value=""
        createForm.content.value=""
    })
    .catch((err)=>{
        console.log(err.message)
    })
})