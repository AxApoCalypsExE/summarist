"use client";

import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

export const getCheckoutUrl = async (
  app: FirebaseApp,
  priceId: string
): Promise<string> => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not authenticated");

  const db = getFirestore(app);
  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  console.log("Adding checkout session document...");
  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    success_url: `${window.location.origin}/for-you`,
    cancel_url: window.location.origin,
  });
  console.log("Checkout session document added with ID:", docRef.id);

  return new Promise<string>((resolve, reject) => {
    console.log("Setting up snapshot listener for document ID:", docRef.id);

    const timeoutDuration = 30000; // 30 seconds
    const timeoutId = setTimeout(() => {
      console.error(
        `Timeout: No response from backend process after ${timeoutDuration}ms.`
      );
      unsubscribe();
      reject(
        new Error(
          `Timeout: No response from backend process after ${timeoutDuration}ms.`
        )
      );
    }, timeoutDuration);

    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        console.log("Snapshot received:", snap);

        if (!snap.exists()) {
          console.log("Document does not exist yet. Waiting for update...");
          return;
        }

        const data = snap.data();
        console.log("Snapshot data:", data);

        if (!data) {
          console.log("Data is undefined. Waiting for next update...");
          return;
        }

        const { error, url } = data as {
          error?: { message: string };
          url?: string;
        };

        if (error) {
          console.error("Error found in snapshot data:", error);
          clearTimeout(timeoutId);
          unsubscribe();
          reject(new Error(`An error occurred: ${error.message}`));
        } else if (url) {
          console.log("Stripe Checkout URL found:", url);
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(url);
        } else {
          console.log(
            "Neither 'error' nor 'url' found in snapshot data. Waiting for next update..."
          );
        }
      },
      (snapshotError) => {
        console.error("Snapshot listener encountered an error:", snapshotError);
        clearTimeout(timeoutId);
        unsubscribe();
        reject(snapshotError);
      }
    );

    // Optional: Implement a loading indicator in your UI while awaiting this promise
  });
};

// export const getPortalUrl = async (app: FirebaseApp): Promise<string> => {
//   const auth = getAuth(app);
//   const user = auth.currentUser;

//   let dataWithUrl: any;
//   try {
//     const functions = getFunctions(app, "us-central1");
//     const functionRef = httpsCallable(
//       functions,
//       "ext-firestore-stripe-payments-createPortalLink"
//     );
//     const { data } = await functionRef({
//       customerId: user?.uid,
//       returnUrl: window.location.origin,
//     });

//     // Add a type to the data
//     dataWithUrl = data as { url: string };
//     console.log("Reroute to Stripe portal: ", dataWithUrl.url);
//   } catch (error) {
//     console.error(error);
//   }

//   return new Promise<string>((resolve, reject) => {
//     if (dataWithUrl.url) {
//       resolve(dataWithUrl.url);
//     } else {
//       reject(new Error("No url returned"));
//     }
//   });
// };
