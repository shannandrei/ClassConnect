import React, {useContext, useEffect, useState} from "react";
import {auth} from "../config/firebase";

import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // Assuming you have firestore initialized and exported as db


import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    updateProfile,
    sendPasswordResetEmail
} from "firebase/auth";


const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe;
    }, []);

    async function signup(email, password, firstname, lastname) {
          try {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
      
              // Create a user document in Firestore
              const userRef = doc(db, "users", user.uid);
              await setDoc(userRef, {
                  fullname: `${firstname} ${lastname}`,
                  role: "student", // Default role is student
                  dob: null,
                  course: null,
                  yearlvl: null,
                  class_schedule: []
              });
      
              // Update the user profile with the display name
              await updateProfile(user, {
                  displayName: `${firstname} ${lastname}`
              });
              
              return user;
          } catch (error) {
              if (error.code === 'auth/email-already-in-use') {
                  throw new Error('The email address is already in use by another account.');
              } else {
                  throw error;
              }
          }
      }
    async function login(email, password) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
      
          if (!user.emailVerified) {
            signOut(auth);
            throw new Error('Please verify your email before logging in.');
          }
      
          return user;
        } catch (error) {
          console.error("Error logging in:", error);
          throw error;
        }
      }
    
      async function logout() {
        try {
          await signOut(auth);
        } catch (error) {
          console.error("Error logging out:", error);
          throw error;
        }
      }

      async function resetPassword(email) {
        try {
          // Attempt to send the password reset email
          await sendPasswordResetEmail(auth, email, {
            url: `http://localhost:3000/login`
          });
          console.log('sent');
        } catch (error) {
          // Check if the error is due to the user not found
          if (error.code === 'auth/user-not-found') {
            // Throw a custom error indicating that the email was not found
            throw new Error('Email not found.');
          }
          // If the error is not related to user not found, re-throw the original error
          throw error;
        }
      }

      function changeEmail(email) {
        return updateEmail(currentUser, email);
      }

      function changePassword(password) {
        return updatePassword(currentUser, password);
      }

      function changeProfileDisplayName(displayName) {
        return updateProfile(currentUser, {
          displayName
        }); 
      }

      function changeProfilePhotoURL(photoURL) {
        return updateProfile(currentUser, {
          photoURL
        });
      }
      
      
      


    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        changeEmail,
        changePassword,
        changeProfileDisplayName,
        changeProfilePhotoURL
    }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}