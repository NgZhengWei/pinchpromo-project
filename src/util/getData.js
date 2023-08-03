import { db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

async function getOneUser(uid) {
  try {
    const userSnapshot = await getDoc(doc(db, "users", uid));
    const user = userSnapshot.data();
    return user;
  } catch (e) {
    console.error(e);
    return `Error getting user with uid ${uid}`;
  }
}

// async function getAllPromotions(uid) {
//     try {
//         const bigPromotionsCollectionRef = collection(db, "bigPromotions");
//         const data = await getDocs(bigPromotionsCollectionRef);

//         userRef = doc(db, "users", uid);
//         const userData = await getDoc(userRef);
//         setUserData(userData.data());

//         filteredData = data.docs.map((doc) => ({
//           ...doc.data(),
//           id: doc.id,
//           promotions: userData.data().promotions,
//           usedPromotions: userData.data().usedPromotions,
//           claimAvailable: userData.data().claimAvailable,
//         }));
//       } catch (e) {
//         console.error(e);
//       }
// }

export { getOneUser };
