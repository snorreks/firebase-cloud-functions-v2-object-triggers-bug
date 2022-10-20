To reproduce the error
```
Error: storage event trigger is missing bucket filter: {
  "eventType": "google.cloud.storage.object.v1.finalized",
  "retry": false,
  "eventFilters": {
    "resource": "mailvideo-test.appspot.com"
  }
}
```


1. Replace the project id in the `.firebaserc` file with your project id.
2. Replace the `region` in `./src/index.ts` with the region where your bucket is.
3. run npm build.
4. run npm deploy.