/* === Imports === */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore ,
        collection,
        addDoc,
        serverTimestamp,
        onSnapshot,
        query, 
        where, 
        orderBy,
        doc,
        updateDoc,
        deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

/* === Firebase Setup === */
const firebaseConfig = {
  apiKey: "AIzaSyDZdTGxXXhRySzicycf8DsY3K_X6Hxxlqw",
  authDomain: "emosense-4ac09.firebaseapp.com",
  projectId: "emosense-4ac09",
  storageBucket: "emosense-4ac09.appspot.com",
  messagingSenderId: "832682323117",
  appId: "1:832682323117:web:8df3e4cedf0fd69e862a24",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); //creating instance to use authentication firebase service , auth object is used for user signing in
// console.log(auth)
//   console.log(app.options.projectId);
/* === UI === */

/* == UI - Elements == */
const provider = new GoogleAuthProvider();
const db = getFirestore(app)
// console.log(db);
const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");

const signInWithGoogleButtonEl = document.getElementById(
  "sign-in-with-google-btn"
);

const emailInputEl = document.getElementById("email-input");
const passwordInputEl = document.getElementById("password-input");

const signInButtonEl = document.getElementById("sign-in-btn");
const createAccountButtonEl = document.getElementById("create-account-btn");

const signOutButtonEl = document.getElementById("sign-out-btn");

const userProfilePictureEl = document.getElementById("user-profile-picture");
const userGreetingEl=document.getElementById("user-greeting");

// const displayNameInputEl = document.getElementById("display-name-input")
// const photoURLInputEl = document.getElementById("photo-url-input")
// const updateProfileButtonEl = document.getElementById("update-profile-btn")

const updateContainerEl = document.getElementById('display-update')
const displayNameInputEl = document.getElementById("display-name-input")
const photoURLInputEl = document.getElementById("photo-url-input")
const updateProfileButtonEl = document.getElementById("update-profile-btn")

const moodEmojiEls = document.getElementsByClassName("mood-emoji-btn")

const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")

const allFilterButtonEl = document.getElementById("all-filter-btn")

const filterButtonEls = document.getElementsByClassName("filter-btn")

const postsEl = document.getElementById("posts")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle);

signInButtonEl.addEventListener("click", authSignInWithEmail);
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail);

signOutButtonEl.addEventListener("click", authSignOut);

for (let moodEmojiEl of moodEmojiEls) {
  moodEmojiEl.addEventListener("click", selectMood)
}

for (let filterButtonEl of filterButtonEls) {
  filterButtonEl.addEventListener("click", selectFilter)
}
updateProfileButtonEl.addEventListener("click", authUpdateProfile)

postButtonEl.addEventListener("click", postButtonPressed)


/* === State === */
let moodState=0;


/* === Global State === */
const collectionName="posts";
/* === Main Code === */

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView();
    showProfilePicture(userProfilePictureEl, user);
    showUserGreeting(userGreetingEl, user);
    // fetchInRealtimeAndRenderPostsFromDB(user);
    updateFilterButtonStyle(allFilterButtonEl)
    fetchAllPosts(user)
    
    if(!user.photoURL){
      showView(updateContainerEl)
      
    } else {
      hideView(updateContainerEl)
    }

  

  } else {
    showLoggedOutView();
  
  }
});

showLoggedOutView();

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
  console.log("Sign in with Google");

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // // The signed-in user info.
      // const user = result.user;
      // // IdP data available using getAdditionalUserInfo(result)
      // ...
      console.log("Sign in WIth google");
    })
    .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.customData.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error.message);
      // ...
    });
}

function authSignInWithEmail() {
  console.log("Sign in with email and password");
  const email = emailInputEl.value;
  const password = passwordInputEl.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      clearAuthFields();
    })
    .catch((error) => {
      console.error(error.message);
      alert("Invalid Email or Password: "+ error.message);
    });
}

function authCreateAccountWithEmail() {
  console.log("Sign up with email and password");
  /*  Challenge:
		Import the createUserWithEmailAndPassword function from 'firebase/auth'

        Use the code from the documentaion to make this function work.
        
        Make sure to first create two consts, 'email' and 'password', to fetch the values from the input fields emailInputEl and passwordInputEl.
       
        If the creation of user is successful then you should show the logged in view using showLoggedInView()
        If something went wrong, then you should log the error message using console.error.
    */

  // const auth = getAuth(); //since we have globally created it earlier
  const email = emailInputEl.value;
  const password = passwordInputEl.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // // Signed up
      // const user = userCredential.user;
      // // ...  if signed up succes
      clearAuthFields();
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // ..
      console.error(error.message);
    });
}

function authSignOut() {
  /*  Challenge:
		Import the signOut function from 'firebase/auth'

        Use the code from the documentaion to make this function work.
       
        If the log out is successful then you should show the logged out view using showLoggedOutView()
        If something went wrong, then you should log the error message using console.error.
    */

  signOut(auth)
    .then(() => {})
    .catch((error) => {
      console.log(error.message);
    });
}

function authUpdateProfile(){
  const newDisplayName = displayNameInputEl.value;
  const newPhotoURL = photoURLInputEl.value;
  updateProfile(auth.currentUser, {
    displayName: newDisplayName, photoURL: newPhotoURL
  }).then(() => {
    console.log(`Profile Updated`)
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`${errorCode} - ${errorMessage}`)
  });
}

/* = Functions - Firebase - Cloud Firestore = */

async function addPostToDB(postBody,user) {
  try {
      const docRef = await addDoc(collection(db, collectionName), {
          body: postBody,
          uid:user.uid,
          createdAt: serverTimestamp(),
          mood:moodState
      })
      console.log("Document written with ID: ", docRef.id)
  } catch (error) {
      console.error(error.message)
  }

}

async function updatePostInDB(docId, newBody) {
  /* Challenge:
      Import updateDoc and doc from 'firebase/firestore'
      
      Use the code from the documentation to make this function work.
      
      The function should update the correct post in the database using the docId.
      
      The body field should be updated with newBody as the new value.
   */
  const postRef = doc(db, collectionName, docId);

  await updateDoc(postRef, {
      body: newBody
  })
}

async function deletePostFromDB(docId) {
  /* Challenge:
      Import deleteDoc and doc from 'firebase/firestore'
      
      Use the code from the documentation to make this function work.
      
      The function should delete the correct post in the database using the docId
   */
  await deleteDoc(doc(db, collectionName, docId))
}

function fetchInRealtimeAndRenderPostsFromDB(query,user) {

  // const postRef=collection(db, collectionName)
  
  // const q = query(postRef, where("uid", "==", user.uid),orderBy("createdAt", "desc"))
  onSnapshot(query, (querySnapshot) => {
      clearAll(postsEl)
      
      querySnapshot.forEach((doc) => {
          renderPost(postsEl, doc)
      })
  })
}

function fetchTodayPosts(user){
  
  const startOfDay= new Date();
  startOfDay.setHours(0,0,0,0);

  const endOfDay= new Date();
  endOfDay.setHours(23,59,59,999);

  const postsRef=collection(db,collectionName)

  const q = query(postsRef, where("uid","==", user.uid),
                            where("createdAt",">=",startOfDay),
                            where("createdAt","<=",endOfDay),
                            orderBy("createdAt","desc")
                          )
  fetchInRealtimeAndRenderPostsFromDB(q,user);
}

function fetchWeekPosts(user) {
  const startOfWeek = new Date()
  startOfWeek.setHours(0, 0, 0, 0)
  
  if (startOfWeek.getDay() === 0) { // If today is Sunday
      startOfWeek.setDate(startOfWeek.getDate() - 6) // Go to previous Monday
  } else {
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
  }
  
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)
  
  const postsRef = collection(db, collectionName)
  
  const q = query(postsRef, where("uid", "==", user.uid),
                            where("createdAt", ">=", startOfWeek),
                            where("createdAt", "<=", endOfDay),
                            orderBy("createdAt", "desc"))
                            
  fetchInRealtimeAndRenderPostsFromDB(q, user)
}

function fetchMonthPosts(user) {
  const startOfMonth = new Date()
  startOfMonth.setHours(0, 0, 0, 0)
  startOfMonth.setDate(1)

  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

const postsRef = collection(db, collectionName)
  
  const q = query(postsRef, where("uid", "==", user.uid),
                            where("createdAt", ">=", startOfMonth),
                            where("createdAt", "<=", endOfDay),
                            orderBy("createdAt", "desc"))

  fetchInRealtimeAndRenderPostsFromDB(q, user)
}

function fetchAllPosts(user) {
  const postsRef = collection(db, collectionName)
  
  const q = query(postsRef, where("uid", "==", user.uid),
                            orderBy("createdAt", "desc"))

  fetchInRealtimeAndRenderPostsFromDB(q, user)
}


/* == Functions - UI Functions == */

// function renderPost(postsEl, postData) {
//   /*  Challenge:
//   This function takes in the posts element and post data (doc.data())
      
//       Use the example post HTML code from index.html to make this function render a post using innerHTML on postsEl.
      
//       Each post should dynamically include the:
//       - Post createdAt date (use the displayDate function to convert to correct format)
//       - Post mood emoji image
//       - Post body
//   */
//       postsEl.innerHTML += `
//       <div class="post">
//           <div class="header">
//               <h3>${displayDate(postData.createdAt)}</h3>
//               <img src="assets/emojis/${postData.mood}.png">
//           </div>
//           <p>
//               ${replaceNewlinesWithBrTags(postData.body)}
//           </p>
//       </div>
//   `
// }


function createPostHeader(postData) {
  /*
      <div class="header">
      </div>
  */
  const headerDiv = document.createElement("div")
  headerDiv.className = "header"
  
      /* 
          <h3>21 Sep 2023 - 14:35</h3>
      */
      const headerDate = document.createElement("h3")
      headerDate.textContent = displayDate(postData.createdAt)
      headerDiv.appendChild(headerDate)
      
      /* 
          <img src="assets/emojis/5.png">
      */
      const moodImage = document.createElement("img")
      moodImage.src = `assets/emojis/${postData.mood}.png`
      headerDiv.appendChild(moodImage)
      
  return headerDiv
}

function createPostBody(postData) {
  /*
      <p>This is a post</p>
  */
  const postBody = document.createElement("p")
  postBody.innerHTML = replaceNewlinesWithBrTags(postData.body)
  
  return postBody
}

function createPostUpdateButton(wholeDoc) {
  const postId = wholeDoc.id
  const postData = wholeDoc.data()
  
  /* 
      <button class="edit-color">Edit</button>
  */
  const button = document.createElement("button")
  button.textContent = "Edit"
  button.classList.add("edit-color")
  button.addEventListener("click", function() {
      const newBody = prompt("Edit the post", postData.body)
      
      if (newBody) {
          updatePostInDB(postId, newBody)
      }
  })
  
  return button
}

function createPostDeleteButton(wholeDoc) {
  const postId = wholeDoc.id
  
  /* 
      <button class="delete-color">Delete</button>
  */
  const button = document.createElement('button')
  button.textContent = 'Delete'
  button.classList.add("delete-color")
  button.addEventListener('click', function() {
      deletePostFromDB(postId)
      
  })
  return button
}

function createPostFooter(wholeDoc) {
  /* 
      <div class="footer">
          <button>Edit</button>
          <button>Delete</button>
      </div>
  */
  const footerDiv = document.createElement("div")
  footerDiv.className = "footer"
  
  footerDiv.appendChild(createPostUpdateButton(wholeDoc))
  footerDiv.appendChild(createPostDeleteButton(wholeDoc))
  
  return footerDiv
}

function renderPost(postsEl,wholeDoc) {
  
  const postData=wholeDoc.data();
  /* 
      <div class="post">
          This is the post
      </div>
   */

  const postDiv = document.createElement("div")
  postDiv.className = "post"
  
  postDiv.appendChild(createPostHeader(postData))
  postDiv.appendChild(createPostBody(postData))
  postDiv.appendChild(createPostFooter(wholeDoc))

  postsEl.appendChild(postDiv)
}


function replaceNewlinesWithBrTags(inputString) {
  return inputString.replace(/\n/g, "<br>")
}


function postButtonPressed() {
  const postBody = textareaEl.value
  const user = auth.currentUser
  if (postBody && moodState) {
      addPostToDB(postBody,user)
      clearInputField(textareaEl)
      resetAllMoodElements(moodEmojiEls)
  }
}

function clearAll(element) {
  element.innerHTML = ""
}

function showLoggedOutView() {
  hideElement(viewLoggedIn);
  showElement(viewLoggedOut);
}

function showLoggedInView() {
  hideElement(viewLoggedOut);
  showElement(viewLoggedIn);
}

function showElement(element) {
  element.style.display = "flex";
}

function hideElement(element) {
  element.style.display = "none";
}
function clearInputField(field) {
  field.value = "";
}

function clearAuthFields() {
  clearInputField(emailInputEl);
  clearInputField(passwordInputEl);
}

function showProfilePicture(imgElement, user) {
  const photoURL = user.photoURL;

  if (photoURL) {
    imgElement.src = photoURL;
  } else {
    imgElement.src = "assets/defaultProfilePic.png";
  }
}

// function authUpdateProfile() {
//   /*  Challenge:
//       Import the updateProfile function from 'firebase/auth'
  
//       Use the documentation to make this function work.
      
//       Make sure to first create two consts, 'newDisplayName' and 'newPhotoURL', to fetch the values from the input fields displayNameInputEl and photoURLInputEl.
      
//       If the updating of profile is successful then you should console log "Profile updated".
//       If something went wrong, then you should log the error message using console.error
      
//       Resources:
//       Justin Bieber profile picture URL: https://i.imgur.com/6GYlSed.jpg
//   */
//       const newDisplayName=displayNameInputEl.value;
//       const newPhotoURL=photoURLInputEl.value;
//   updateProfile(auth.currentUser, {
    
//           displayName: newDisplayName,
//           photoURL: newPhotoURL
//       }).then(() => {
//       console.log("Profile Updated");
//       }).catch((error) => {
//    console.log(error.message);
//       })
// }

function showUserGreeting(element, user) {
  /*  Challenge:
      Use the documentation to make this function work.
      
      This function has two parameters: element and user
      
      We will call this function inside of onAuthStateChanged when the user is logged in.
      
      The function will be called with the following arguments:
      showUserGreeting(userGreetingEl, user)
      
      If the user has a display name, then set the textContent of element to:
      "Hey John, how are you?"
      Where John is replaced with the actual first name of the user
      
      Otherwise, set the textContent of element to:
      "Hey friend, how are you?" 
  */
  const displayName = user.displayName;
  if (displayName) {
    const userFirstName = displayName.split(" ")[0];

    element.textContent = `Hey ${userFirstName}, how are you?`;
  } else {
    element.textContent = `Hey friend, how are you?`;
  }
}

function displayDate(firebaseDate) {

  if(!firebaseDate){
    return "Date Processing";
  }

  const date = firebaseDate.toDate()
  
  const day = date.getDate()
  const year = date.getFullYear()
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = monthNames[date.getMonth()]

  let hours = date.getHours()
  let minutes = date.getMinutes()
  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes

  return `${day} ${month} ${year} - ${hours}:${minutes}`
}



/* = Functions - UI Functions - Mood = */

function selectMood(event) {
  const selectedMoodEmojiElementId = event.currentTarget.id
  
  changeMoodsStyleAfterSelection(selectedMoodEmojiElementId, moodEmojiEls)
  
  const chosenMoodValue = returnMoodValueFromElementId(selectedMoodEmojiElementId)
  
  moodState = chosenMoodValue
}

function changeMoodsStyleAfterSelection(selectedMoodElementId, allMoodElements) {
  for (let moodEmojiEl of moodEmojiEls) {
      if (selectedMoodElementId === moodEmojiEl.id) {
          moodEmojiEl.classList.remove("unselected-emoji")          
          moodEmojiEl.classList.add("selected-emoji")
      } else {
          moodEmojiEl.classList.remove("selected-emoji")
          moodEmojiEl.classList.add("unselected-emoji")
      }
  }
}

function resetAllMoodElements(allMoodElements) {
  for (let moodEmojiEl of allMoodElements) {
      moodEmojiEl.classList.remove("selected-emoji")
      moodEmojiEl.classList.remove("unselected-emoji")
  }
  
  moodState = 0
}

function returnMoodValueFromElementId(elementId) {
  return Number(elementId.slice(5))
}

/* == Functions - UI Functions - Date Filters == */

function resetAllFilterButtons(allFilterButtons) {
  for (let filterButtonEl of allFilterButtons) {
      filterButtonEl.classList.remove("selected-filter")
  }
}

function updateFilterButtonStyle(element) {
  element.classList.add("selected-filter")
}

function fetchPostsFromPeriod(period, user) {
  if (period === "today") {
      fetchTodayPosts(user)
  } else if (period === "week") {
      fetchWeekPosts(user)
  } else if (period === "month") {
      fetchMonthPosts(user)
  } else {
      fetchAllPosts(user)
  }
}

function selectFilter(event) {
  const user = auth.currentUser
  
  const selectedFilterElementId = event.target.id
  
  const selectedFilterPeriod = selectedFilterElementId.split("-")[0]
  
  const selectedFilterElement = document.getElementById(selectedFilterElementId)
  
  resetAllFilterButtons(filterButtonEls)
  
  updateFilterButtonStyle(selectedFilterElement)
    
  fetchPostsFromPeriod(selectedFilterPeriod, user)
 
}