import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { db } from "../firebase";
import Navbar from "./Navbar";

function ProfileComp() {

  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [postIds, setPostIds] = useState([])
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log(user.uid);
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      console.log("hello", doc.data());
      setUserData(doc.data());
      setPostIds(doc.data().posts)   // current user doc ka details ka posts section 
    });
    return () => {
      unsub();
    };
  }, [user]);


  useEffect(() => {
    let tempArray = [];
    postIds.map((postid,idx)=>{
      const unsub = onSnapshot(doc(db,"posts",postid),(doc)=>{
        tempArray.push(doc.data())
        console.log(tempArray);
        setPosts([...tempArray])
      })
      
    })
  },[postIds])

  return (
    <div>
      <Navbar />
      <div>
        <div className="profile_upper">
          <img
            src={userData?.photoURL}
            style={{ height: "8rem", width: "8rem", borderRadius: "50%" }}
          />
          <div style={{ flexBasis: "40%" }}>
            <h1>{userData?.name}</h1>
            <h3>Posts : {userData?.posts?.length}</h3>
          </div>
        </div>
        <hr />

        <div className="profile_videos">
          {
            posts.map((post)=>(
              <video src={post.postUrl}/>
            ))
          }
          
          
        </div>
      </div>
    </div>
  );
}

export default ProfileComp;
