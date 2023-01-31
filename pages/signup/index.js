import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import insta from "../../assets/insta.jpg";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

function Index() {
  
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup, user } = useContext(AuthContext);

  const handleClick = async () => {
    // console.log(file);
    // console.log(email);
    // console.log(password);
    // console.log(name);

    try {
      setLoading(true);
      setError("");
      const user = await signup(email, password);
      console.log("Signed Up !");

      const storageRef = ref(storage, `${user.uid}/Profile`);

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
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
         
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            console.log("File available at", downloadURL);

            let obj = {
              name: name,
              email: email,
              uid : user.user.uid,
              photoURL: downloadURL,
              posts: []
            }
           await setDoc(doc(db,"users",user.user.uid),obj)
            console.log("doc added on firestore database")
          });
        }
      );
    } catch (err) {
      console.log(err);
      setError(err.message);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      console.log("Not logged In !");
    }
  }, [user]);

  return (
    <div className="signup-container">
      <div className="signup-card">
        <Image src={insta} />

        <TextField
          size="small"
          margin="dense"
          id="outlined-basic"
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          type="password"
          size="small"
          margin="dense"
          id="outlined-basic"
          fullWidth
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          size="small"
          margin="dense"
          id="outlined-basic"
          fullWidth
          label="Full Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button
          fullWidth
          variant="outlined"
          component="label"
          style={{ marginTop: "1rem" }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          UPLOAD PROFILE IMAGE
        </Button>

        <Button
          variant="contained"
          fullWidth
          style={{ marginTop: "1rem" }}
          onClick={handleClick}
          disabled={loading}
        >
          Sign Up
        </Button>
      </div>
      <div className="bottom-card">
        Already Have an account?{" "}
        <Link href="/login">
          <span style={{ color: "blue" }}>Login</span>
        </Link>
      </div>
    </div>
  );
}

export default Index;
