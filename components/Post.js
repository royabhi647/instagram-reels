import { Avatar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { AuthContext } from "../context/auth";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import * as ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardActions } from "@mui/material";
import Comment from "./Comment";
import DisplayComments from "./DisplayComments";

function Post({ postData, userData }) {
  // console.log(postData);
  // console.log(userData);

  const { user } = useContext(AuthContext);
  const [like, setLike] = useState(false);
  const [isMute, setIsMute] = useState(true);

  useEffect(() => {
    if (postData.likes.includes(user.uid)) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [postData]);

  const handleLike = async () => {
    if (!like) {
      await updateDoc(doc(db, "posts", postData.postId), {
        likes: arrayUnion(user.uid),
      });
    } else {
      await updateDoc(doc(db, "posts", postData.postId), {
        likes: arrayRemove(user.uid),
      });
    }
  };

  const handleMute = () => {
    if (isMute) {
      setIsMute(false);
    } else {
      setIsMute(true);
    }
  };

  const handleNextVideo = (e) => {
    //get the next video
    let nextVideo = ReactDOM.findDOMNode(e.target).parentNode.nextSibling;
    if (nextVideo) {
      nextVideo.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="post-container">
      <video
        src={postData.postUrl}
        autoPlay
        controls
        muted={isMute}
        onClick={handleMute}
        onEnded={handleNextVideo}
      />
      <div className="videos-info">
        <div className="avatar-container">
          <Avatar
            alt="Remy Sharp"
            src={postData.profileUrl}
            sx={{ margin: "0.5rem" }}
          />
          <p style={{ color: "white", fontWeight: "bold" }}>
            {postData.profileName}
          </p>
        </div>
        <div className="post-like">
          <FavoriteIcon
            fontSize="large"
            style={like ? { color: "red" } : { color: "white" }}
            onClick={handleLike}
          />
          {postData.likes.length > 0 && postData.likes.length}
          <AddCommentIcon className="chat-styling" onClick={handleClickOpen} />
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth="md"
          >
            <div className="modal-container">
              <div className="video-modal">
                <video src={postData.postUrl} autoPlay controls muted />
              </div>
              <div className="comments-modal">
                <Card className="card1">
                    <DisplayComments postData={postData}/>
                </Card>
                <Card className="card2">
                  <Typography sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                    {postData.likes.length == 0
                      ? "Be the first one to like this post"
                      : `Liked by ${postData.likes.length+" "}users`}
                  </Typography>
                  {/* heart */}
                  <div className="post-like2">
                    <FavoriteIcon
                      fontSize="large"
                      style={like ? { color: "red" } : { color: "black" }}
                      onClick={handleLike}
                    />
                   <Comment userData={userData} postData={postData}/>
                  </div>
                </Card>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Post;
