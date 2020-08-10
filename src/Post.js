import React, { useState, useEffect } from 'react'
import './Post.css'
import {Avatar} from '@material-ui/core'
import firebase from 'firebase';
import { db } from './firebase';

function Post({postId,user,username, caption, imageUrl}) {
    const [comments,setComments] = useState([]);
    const[comment,setComment] = useState('');
    //👇 useEffect for comments
    // here we are accessing comments from the new collections created in the firebase
    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            }) ;
        }

        return () =>{
            unsubscribe();
        };
    }, [postId]);
    //posting the comment (function)
    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()   //here we use the variable user who have logged in.
        });
        setComment('');

    }

    return (
        <div className="post">
            <div className = "post__header">
                <Avatar
                    className="post__avatar"
                     alt={username}
                    src="/static/images/avatar/1.jpg"
                />
        <h3>{username}</h3>
        </div>
            {/* header -> avatar + username*/}
            <img className = "post__image" src={imageUrl}
            alt="image can't be loaded"
            />
            {/* image */}
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            {/* username + caption */}

            {/*showing posted comments */}
            <div className = "post__comments">
            {
                comments.map((comment)=>(
                    <p>
                    <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))
            }

            </div>
            {/* only displays the commentbox if the user is loggedin */}
            {user &&(
                <form className="post__commentBox">

                <input
                    className = "post__input"
                    type = "text"
                    placeholder = "Add a Comment.."
                    value = {comment}

                    onChange = {(e)=>setComment(e.target.value)}
                
                />
                <button
                disabled = {!comment}
                className = "post__button"
                type="submit"
                onClick={postComment}
                >
                Post
                </button>
            </form>  
            )}



            {/*for comments👇 */}

            
            

                    
        </div>
    )
}

export default Post
