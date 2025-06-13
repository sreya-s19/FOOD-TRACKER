import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR ID",
  authDomain: "YOUR ID",
  projectId: "YOUR ID",
  storageBucket: "YOUR ID",
  messagingSenderId: "YOUR ID",
  appId: "YOUR ID",
  measurementId: "YOUR ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  console.log("Auth state changed:", user ? "User logged in" : "User logged out");
  
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists() && userDoc.data().name) {
      // Full profile already exists
      document.getElementById("auth-container").style.display = "none";
      document.getElementById("profile-form").style.display = "none";
      document.getElementById("scanner-container").style.display = "block";
      document.getElementById("status").innerText = `Logged in as ${user.email}`;
    } else {
      // Ask for more profile info
      document.getElementById("auth-container").style.display = "none";
      document.getElementById("profile-form").style.display = "block";
    }
  } else {
    document.getElementById("auth-container").style.display = "block";
    document.getElementById("scanner-container").style.display = "none";
    document.getElementById("profile-form").style.display = "none";
    document.getElementById("status").innerText = "";
  }
});

// Sign up user
async function register() {
  console.log("Register function called");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("Email:", email, "Password length:", password.length);

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  try {
    document.getElementById("status").innerText = "Creating account...";
    await createUserWithEmailAndPassword(auth, email, password);
    document.getElementById("status").innerText = "✅ Registered! Please complete your profile.";
  } catch (error) {
    console.error("Registration error:", error);
    document.getElementById("status").innerText = `❌ ${error.message}`;
  }
}

// Log in user
async function login() {
  console.log("Login function called");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("Email:", email, "Password length:", password.length);

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  try {
    document.getElementById("status").innerText = "Logging in...";
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("status").innerText = "✅ Logged in!";
  } catch (error) {
    console.error("Login error:", error);
    document.getElementById("status").innerText = `❌ ${error.message}`;
  }
}

// Submit additional profile info
async function submitProfile() {
  console.log("Submit profile function called");
  const user = auth.currentUser;
  if (!user) return;

  const name = document.getElementById("name").value.trim();
  const height = document.getElementById("height").value.trim();
  const weight = document.getElementById("weight").value.trim();
  const targetWeight = document.getElementById("targetWeight").value.trim();
  const age = document.getElementById("age").value.trim();
  const gender = document.getElementById("gender").value;

  if (!name || !height || !weight || !targetWeight || !age || !gender) {
    alert("Please fill in all profile fields.");
    return;
  }

  try {
    document.getElementById("status").innerText = "Saving profile...";
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name,
      height,
      weight,
      targetWeight,
      age,
      gender,
      createdAt: serverTimestamp()
    });

    document.getElementById("profile-form").style.display = "none";
    document.getElementById("scanner-container").style.display = "block";
    document.getElementById("status").innerText = "✅ Profile completed!";
  } catch (error) {
    console.error("Profile save error:", error);
    document.getElementById("status").innerText = `❌ ${error.message}`;
  }
}

async function logout() {
  console.log("Logout function called");
  try {
    await signOut(auth);
    document.getElementById("status").innerText = "Logged out.";
  } catch (error) {
    console.error("Logout error:", error);
    document.getElementById("status").innerText = `❌ ${error.message}`;
  }
}

// IMPORTANT: Expose functions to global scope for HTML onclick handlers
window.register = register;
window.login = login;
window.submitProfile = submitProfile;
window.logout = logout;

// Debug: Log when script loads
console.log("Script.js loaded, functions exposed to window:", {
  register: typeof window.register,
  login: typeof window.login,
  submitProfile: typeof window.submitProfile,
  logout: typeof window.logout
});