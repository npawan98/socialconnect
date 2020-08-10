import React, {useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db,auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

import InstagramEmbed from 'react-instagram-embed'; //insta emnbid

import CloudUploadIcon from '@material-ui/icons/CloudUpload';


//styling for modal 🎨
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// main functin starts here
function App() {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [posts, setposts] = useState([
   // {username="pawan" caption ="heyy loved this 💕 SocialConnect" imageUrl = "https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY"},
    // {
    //   username:"pawan",
    //   caption :"heyy loved this 💕 SocialConnect",
    //   imageUrl : "https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY"
    // },
    // { 
    //   username:"Priyal",
    //    caption : "hey pawan 🤟! jus kidding",
    //     imageUrl : "https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ"
    //   },
    //   { 
    //     username:"Priyal Bajaj",
    //      caption : "Awwww....",
    //       imageUrl : "https://i.picsum.photos/id/1012/3973/2639.jpg?hmac=s2eybz51lnKy2ZHkE2wsgc6S81fVD1W2NKYOSh8bzDc"
    //     }
  ]);
  const[username,setUsername] = useState('');
  const[email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  //for AUTH
  const [user, setUser] = useState(null);
  //useState(variable) for modal 
   const [open, setOpen] = useState(false);
   const [openSignIn,setOpenSignIn] = useState(false);
   //my creation upload modal
   const [openUpload,setOpenUpload] = useState(false);

  //auth part
// adding unsubscribe 👇 prevents some spaming check video once

  useEffect(()=>{
    const unsubscribe =auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user is logged in..
        console.log(authUser);
        setUser(authUser);
        //it checks weather the user is still loged in or not even if the page is reloaded
        // if (authUser.displayName){
        //   //don't update username 
        // }else{
        //   // if we just created someone
        //   return authUser.updateProfile({
        //     displayName: username,
        //   })
        // }
        // comment because we have mentiond the same belowreturn 


      }else {
        //user is logged out..
        setUser(null);

      }

    })
    return () => {
      //perform some cleanup actions
      unsubscribe(); 
    }
  },[user, username]);

  // the above code is slightly different from video


  useEffect(() => {
    // code goes here 
    // we are fetching data form the firebase database
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
      //everytime a new post is added, this code will be fired
      setposts(snapshot.docs.map(doc=>({
        id: doc.id,
        post: doc.data()
      })))
    })
  
  }, []);

  const signup = (event) =>{
    event.preventDefault();
    //creating user authentication
    //here email and password are coming from state mentiond above
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error)=>alert(error.message))
    setOpen(false); // here we dont want to be open after signin so we have added this
    
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email,password) //here email and password are from state above
      .catch((error)=>console.log(error.message))

      setOpenSignIn(false); // here we dont want to be open after signin so we have added this
  }

  return (
    // in the example they have given a separate function to close the modal, but we have implement in online function
    // {/**creating a modal for login usinf material ui */}
    <div className="app">

      {/*image uplaod --- here 👇 in user? ? is called optonal*/ }

      <Modal
         open={open}
          onClose={()=>setOpen(false)}
  
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>

            <img src = "https://firebasestorage.googleapis.com/v0/b/socialconnect-2df6b.appspot.com/o/logo%2FAnnotation%202020-07-28%20000841.jpg?alt=media&token=618c588c-600c-42f5-a85c-f0252474f18d"/>
            </center>
            <Input
              placeholder="Username"
              type="text"
              value = {username}
              onChange = {(e)=>setUsername(e.target.value)}
              required
              />
            <Input
              placeholder="Email"
              type="email"
              value = {email}
              onChange = {(e)=>setEmail(e.target.value)}
              />

            <Input 
              placeholder="Password"
              type="password"
              value = {password}
              onChange = {(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick = {signup}>Sign up</Button>
            
          </form>
        </div>
      </Modal>
      {/*👇 login modal  */}
      <Modal 
         open={openSignIn}
          onClose={()=>setOpenSignIn(false)}
  
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img  src = "https://firebasestorage.googleapis.com/v0/b/socialconnect-2df6b.appspot.com/o/logo%2FAnnotation%202020-07-28%20000841.jpg?alt=media&token=618c588c-600c-42f5-a85c-f0252474f18d"/> 
            </center>
            <Input
              placeholder="Email"
              type="email"
              value = {email}
              onChange = {(e)=>setEmail(e.target.value)}
              />

            <Input 
              placeholder="Password"
              type="password"
              value = {password}
              onChange = {(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick = {signIn}>Sign IN</Button>
            
          </form>
        </div>
      </Modal>

      {/* model for upload 
      moved form bottom of the page to a modal*/}
      <Modal 
         open={openUpload}
          onClose={()=>setOpenUpload(false)}
  
        >
        <div style={modalStyle} className={classes.paper}>
        <h3>Upload</h3>
          
          {user?.displayName ? (
            <ImageUpload username = {user.displayName} />
    
          ):(
    
            <h3> Sorry Please Login to Upload...</h3>
          )}
        </div>
      </Modal>









      <div className = "app__header">
        <img
          className = "app__headerImage"
          src = "https://firebasestorage.googleapis.com/v0/b/socialconnect-2df6b.appspot.com/o/logo%2FAnnotation%202020-07-28%20000841.jpg?alt=media&token=618c588c-600c-42f5-a85c-f0252474f18d"
          alt = "instalogo"
        />
        {user ?( // if the user is loged in
          <div >
          <Button className="upload__button"  variant="outlined" color="primary" onClick={()=>setOpenUpload(true)}><CloudUploadIcon/>Upload</Button>
          <Button variant="contained" color="secondary" onClick={()=>auth.signOut()}>Log out</Button>
          </div>
          
        ): // this is or
        <div className="app__loginContainer">
        <Button variant="contained" color="primary"  onClick={()=>setOpenSignIn(true)}>Sign In</Button>
         <Button variant="outlined" color="primary" onClick={()=>setOpen(true)}>Sign Up</Button>
         
         
        </div>
        
      }
      </div>
      

      

        {/*<center><h1>Welcome to SocialConnect 📰 </h1></center>*/}
        <div className = "app__posts">

            <div className="app__postsLeft">
            {/*HEADER*/}
            {
              posts.map(({id,post}) => (
                <Post key={id} postId={id} user={user} username = {post.username} caption = {post.caption} imageUrl = {post.imageUrl}/>
              ))
            }
            {/*<Post username="pawan" caption ="heyy loved this 💕 SocialConnect" imageUrl = "https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY"/>*/}
            {/*posts*/}      
            {/*posts*/}
            
            </div>
            <div className ="app__postsRight">

            <InstagramEmbed
            url='https://www.instagram.com/p/BxSWngsHT5t/?utm_source=ig_web_button_share_sheet'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
            </div>
               
        </div>
        {/*{user?.displayName ? (
          <ImageUpload username = {user.displayName} />
  
        ):(
  
          <h3> Sorry Please Login to Upload...</h3>
        )}*/}
              

       

    </div>
  );
}

export default App;
