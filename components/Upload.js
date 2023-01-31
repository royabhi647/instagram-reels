import { Button } from "@mui/material";
import React, { useState } from "react";
import MovieIcon from "@mui/icons-material/Movie";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import {v4 as uuidv4} from 'uuid';
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function Upload({ userData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if(file == null){
      setError("Please select a file")
      setTimeout(()=>{
        setError("")
      },2000)
      return;
    }
    if((file.size / (1024 * 1024)) > 40){  // 40 MB
      setError("Please select a smaller file")
      setTimeout(()=>{
        setError("")
      },2000)
      return;
    }
    let uid = uuidv4();
    setLoading(true);
    const storageRef = ref(storage, `${userData.uid}/posts/${uid}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const prog =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(prog);
        console.log("Upload is " + prog + "% done");
       
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        setError(error.message)
        setTimeout(()=>{
          setError('')
        },2000)
        return;
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          console.log("File available at", downloadURL);

          let obj = {
            likes: [],
            comments: [],
            postId: uid,
            postUrl: downloadURL,
            profileName: userData.name,
            profileUrl: userData.photoURL,
            uid: userData.uid,
            timestamp: serverTimestamp()
          }
          console.log(obj)
          await setDoc(doc(db,"posts",uid),obj);
          console.log("post added in post collection")
          // update in users, posts ka arr
          await updateDoc(doc(db,"users",userData.uid),{
            posts: arrayUnion(uid)
          })

        
          console.log("doc added ")
          setLoading(false)
          setProgress(0)
        });
      }
    );
  }

  return (
    <div className="upload-btn">
      {error != "" ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Button
          fullWidth
          variant="outlined"
          component="label"
          startIcon={<MovieIcon />}
          style={{ marginTop: "1rem" }}
        >
          <input type="file" accept="video/*" style={{ display: "none" }} onChange={handleChange} />
          UPLOAD
        </Button>
      )}

      {loading && (
        <LinearProgress
          variant="determinate"
          value={progress}
          style={{ marginTop: "0.2rem" }}
        />
      )}
    </div>
  );
}

export default Upload;
