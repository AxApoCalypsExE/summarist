import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
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

  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    success_url: `${window.location.origin}/for-you`,
    cancel_url: `${window.location.origin}/for-you`,
  });

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const { error, url } = snap.data() as {
        error?: { message: string };
        url?: string;
      };
      if (url) {
        console.log("Stripe Checkout URL:", url);
        unsubscribe();
        resolve(url);
      } else if (error) {
        unsubscribe();
        reject(new Error(`An error occurred: ${error.message}`));
      }
    });
  });
};

export const getPortalUrl = async (app: FirebaseApp): Promise<string> => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  try {
    const functions = getFunctions(app, "us-central1");
    const functionRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink"
    );
    const { data } = await functionRef({
      customerId: user?.uid,
      returnUrl: window.location.origin,
    });

    // Add a type to the data
    const dataWithUrl = data as { url: string };

    if (dataWithUrl.url) {
      console.log("Reroute to Stripe portal: ", dataWithUrl.url);
      return dataWithUrl.url;
    } else {
      throw new Error("No URL returned");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve the portal URL");
  }
};
