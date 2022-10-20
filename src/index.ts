import { onObjectFinalized } from "firebase-functions/v2/storage";

export const test = onObjectFinalized({region: 'europe-west1'},(event) => {
  console.log(event);
});
