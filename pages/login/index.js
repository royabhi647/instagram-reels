import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import insta from "../../assets/insta.jpg";
import { Button } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import bg1 from "../../assets/bg1.jpg";
import bg2 from "../../assets/bg2.jpg";
import bg3 from "../../assets/bg3.jpg";
import bg4 from "../../assets/bg4.jpg";
import { AuthContext } from "../../context/auth";
import {useRouter} from 'next/router';
import Link from 'next/link';

function Index() {

  const router = useRouter();

  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[error, setError] = useState('');
  const[loading, setLoading] = useState(false);

  const{login,user} = useContext(AuthContext);


  const handleClick = async() => {
    // console.log(email+" "+password);
    try{
      setLoading(true)
      setError('');
      await login(email,password)
      console.log("Logged In !")
    }catch(err){
      console.log(err);
      setError(err.message)
      setTimeout(()=>{
        setError('')
      },2000)
    }
    setLoading(false)
  }


  useEffect(()=>{
    if(user){
      router.push('/');
    }else{
      console.log("Not logged In !");
    }
  },[user])


  return (
    <div className="login-container">
      <div className="carbg">
        <div className="car">
          <Carousel
            showIndicators={false}
            showThumbs={false}
            showStatus={false}
            showArrows={false}
            infiniteLoop={true}
            interval={2000}
            autoPlay={true}
          >
            <Image src={bg1}></Image>
            <Image src={bg2}></Image>
            <Image src={bg3}></Image>
            <Image src={bg4}></Image>
          </Carousel>
        </div>
      </div>

      <div>
        <div className="login-card">
          <Image src={insta} />

          <TextField
            size="small"
            margin="dense"
            id="outlined-basic"
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
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
            onChange={(e)=>setPassword(e.target.value)}
          />


          {
            error != '' && 
            <div style={{ color: "red" }}>{error}</div>
          }


          <Button variant="contained" fullWidth style={{ marginTop: "1rem" }} onClick={handleClick} disabled={loading}>
            Login
          </Button>

          <div style={{ color: "blue", marginTop: "0.5rem" }}>
            <Link href="forgot">Forgot Password?</Link>
          </div>
        </div>
        <div className="bottom-card">
          Don&apos;t Have an account? <Link href="/signup"><span style={{ color: "blue" }}>Sign Up</span></Link>
        </div>
      </div>
    </div>
  );
}


export default Index;
