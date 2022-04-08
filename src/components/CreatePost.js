import Deso from "deso-protocol";
import { useState } from "react";
import "./CreatePost.css";

const deso = new Deso();

export default function CreatePost({userInfo}) {
    const [postResponse, setPostResponse] = useState();
    const [postContent, setPostContent] = useState();

    const handlePostInput = (event) => {
        setPostContent(event.target.value);
    }

    async function handlePostSubmit() {
        const postResponse = await deso.posts.submitPost({
            UpdaterPublicKeyBase58Check: deso.identity.getUserKey(),
                BodyObj: {
                Body: postContent,
                VideoURLs: [],
                ImageURLs: []
                }
            });
        setPostResponse(JSON.stringify(postResponse, null, 2));
        // console.log("Posting: ", postContent);
        // console.log(postResponse);
    }

    return (
        <>
            <div>
                <p>What's in your mind?</p>
                <div className="post-group">
                    <textarea className="post-textarea" value={postContent} onChange={handlePostInput}></textarea>
                    <button className="submit-btn" onClick={handlePostSubmit}>
                        Submit
                    </button>
                </div>
            </div>
            {
                postResponse &&
                <div className="post-status">
                    <a href={`https://diamondapp.com/u/${userInfo.Profile.Username}`} style={{ color: "white" }}>
                        Posted Successfully
                    </a>
                </div>
            }
    </>
);
}