import React, {useState} from 'react'
import { Button } from '@material-ui/core'
import { db,storage,firebase } from './firebase'; //exported firebase and imported her which was not in the video
import './ImageUpload.css'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';



function ImageUpload({username}) {
    const [caption,setCaption] = useState('');
    const [progress,setProgress] = useState(0);
    const [image,setImage] = useState('');



    const handleChange = (e) => {
        // if multiple files have been selected by the user it only pics the first one 
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }

    }
    const handleUpload = ()=>{
        //uploading the pic to the firebase storage 
        const uploadTask  = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed", // for progress bar (because it is a asyncronous process and it takes time to upload a file)
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100 
                );
                setProgress(progress);
            },
            (error) => {
                //Error Function...
                console.log(error);
                alert(error.message);   
            },
            () => {
                //upload complete function..
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url =>{
                        //post the image inside the database...✅
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption,  
                            imageUrl : url,
                            username: username
                            //here we are uploading the file to the firebase storage
                            //and fetching that image url to the database
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    
                    })
            }
        )
    }

    return (
        <div className = "imageupload">
                {/* we need..  */}
                {/*Caption Input  */}
                {/*fiel picker  */}
                {/*Post button */} 
        <progress className="imageupload__progress" value={progress} max="100"/>
        <input className="imageupload__caption" type = 'text' placeholder = "Enter a caption..." value = {caption} onChange = {event => setCaption(event.target.value)}/>
        <input className="imageupload__file" accept="image/*" type = 'file' onChange = {handleChange} />
        {/*<Button  onClick={handleUpload}>
            Upload
    </Button>*/}

        <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        startIcon={<CloudUploadIcon />}
      >Upload</Button>
        
      
            
        </div>
    )
}

export default ImageUpload
