import Deso from "deso-protocol";
import { useEffect } from "react";
import { useState } from "react";
import "./CreatePost.css";
import Post from "./Post";
import Placeholder from "./Placeholder";

const deso = new Deso();

export default function CreatePost({userInfo}) {
    let userName = userInfo.Profile.Username;
    let userHash = userInfo.Profile.PublicKeyBase58Check;

    const [postResponse, setPostResponse] = useState();
    const [postContent, setPostContent] = useState();
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        let mounted = true;
        async function getUserImg() {
            const request = await deso.posts.getPostsForPublicKey({"Username": userName, "NumToFetch": 20});
            setUserPosts((oldPosts) => {
                return request.Posts.map((post, index) => {
                    return (
                        <Post 
                            key={index}
                            body={post.Body} 
                            rePostCount={post.RepostCount} 
                            commentCount={post.CommentCount} 
                            likeCount={post.LikeCount} 
                            diamondCount={post.DiamondCount} 
                            img={post.ImageURLs && post.ImageURLs[0]} 
                            userName={userName} 
                            userHash={userHash} 
                        />
                    );
                });
            });
        }
        if (mounted) getUserImg();
        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
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
        <div className="create-post">
            <div>
                <h2 style={{"margin": '0px 0px 7px'}}>What's in your mind?</h2>
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
                    <a href={`https://diamondapp.com/u/${userName}`} style={{ color: "white" }}>
                        Posted Successfully
                    </a>
                </div>
            }
        </div>
        <hr style={{"width": "95%", "border": "1px solid #5093e2"}} />
        <div className="user-posts">
            {
                userPosts.length ? 
                <>
                    <h2 style={{"margin": '0px 0px 7px'}}>{userName}'s Posts</h2>
                    {userPosts} 
                </> :
                <Placeholder type="loading" text="Loading User Posts..." />
            }
        </div>
    </>
);
}