import { Avatar, CircularProgress } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

function DisplayComments({ postData }) {
  const [allComments, setAllComments] = useState(null);

  useEffect(() => {
    getComments();
  }, [postData]);

  function getComments() {
    let tempArray = [];
    postData.comments.map(async (commentId) => {
      const docSnap = await getDoc(doc(db, "comments", commentId));
      tempArray.push(docSnap.data());
      setAllComments(tempArray);
    });
  }
  return (
    <diV>
      {allComments == null ? (
        <CircularProgress color="success" />
      ) : (
        <>
          {allComments.map((commentObj) => {
            return (
              <div>
                <Avatar src={commentObj.userDP} />
                <p>
                  <span style={{fontWeight:"bold"}}>{commentObj.userName+"  "}</span>
                  {commentObj.text}
                </p>
              </div>
            );
          })}
        </>
      )}
    </diV>
  );
}

export default DisplayComments;
