import "./Home.css";
import Post from "./Post";
import Placeholder from "./Placeholder";

import Deso from 'deso-protocol';
import { useEffect, useState } from "react";

const deso = new Deso();

export default function Home() {
    const profileKey = deso.identity.getUserKey();

    const [feedPosts, setFeedPosts] = useState([]);
    const [pic, setProfilePic] = useState("");

    useEffect(() => {
        let mounted = true;
        async function getHotFeed() {
            const request = {
                "ResponseLimit": 10
            };
            const response = await deso.posts.getHotFeed(request);
            
            
            const profilePic = await deso.user.getSingleProfilePicture(profileKey);
            setProfilePic(profilePic);
            
            console.log(response.data.HotFeedPage);
            
            const feedData = response.data.HotFeedPage.map((item, index) => {
                return (
                    <Post 
                        key={index}
                        body={item.Body} 
                        rePostCount={item.RepostCount} 
                        commentCount={item.CommentCount} 
                        likeCount={item.LikeCount} 
                        diamondCount={item.DiamondCount} 
                        img={item.ImageURLs && item.ImageURLs[0]} 
                        userName={item.ProfileEntryResponse.Username} 
                        userHash={item.ProfileEntryResponse.PublicKeyBase58Check} 
                    />);
            })
            
            setFeedPosts(feedData);
        }
        if (mounted) getHotFeed();
        
        return () => mounted = false;
    }, [])
    return (
        <>
            {
                (
                    <div className="hot-feed">
                        {/* <Post body="hi, there" rePostCount={15} commentCount={90} likeCount={30} diamondCount={50} img={""} userName="Ahmed Saed" userImg={pic}/> */}
                        {feedPosts}
                    </div>
                ) ||
                <Placeholder type="loading" text="loading" />
            }
        </>
    )
}