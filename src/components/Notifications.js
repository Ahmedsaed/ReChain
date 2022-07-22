import "./Notifications.css";
import Post from "./Post";
import Placeholder from "./Placeholder";

import { useEffect, useState } from "react";
import Deso from 'deso-protocol';

const deso = new Deso();

export default function Notifications() {
    const profileKey = deso.identity.getUserKey();

    const [notData, setNotData] = useState([]);

    useEffect(() => {
        let mounted = true;
        async function getNotificationData() {
            const request = {
                "NumToFetch": 50,
                "PublicKeyBase58Check": profileKey,
                "FetchStartIndex": 100
            };
            const response = await deso.notification.getNotifications(request);

            // console.log(response.data.Notifications);
            const notData = await Promise.all(response.data.Notifications.map(async (item, index) => {
                const user0 = item.Metadata.AffectedPublicKeys[0].PublicKeyBase58Check;
                const user1 = item.Metadata.AffectedPublicKeys[1].PublicKeyBase58Check;
                const response0 = await deso.user.getSingleProfile({"PublicKeyBase58Check": user0});
                const response1 = await deso.user.getSingleProfile({"PublicKeyBase58Check": user1});
                const user0pic = await deso.user.getSingleProfilePicture(user0);
                const user1pic = await deso.user.getSingleProfilePicture(user1);
                
                if (item.Metadata.TxnType === 'LIKE') {                    
                    const postResponse = await deso.posts.getSinglePost({"PostHashHex": item.Metadata.LikeTxindexMetadata.PostHashHex});
                    const postItem = postResponse.data.PostFound;
                    return (
                        <div className="not" key={index}>
                            <div className="not-header">
                                <div className="not-img-cropper">
                                    <img src={user0pic} alt="User" className="not-usr-img"></img>
                                </div>
                                <p>
                                    <span className="not-username">{response0.Profile.Username}</span> liked
                                </p>
                                 
                            </div>
                            <Post 
                                key={index}
                                body={postItem.Body} 
                                rePostCount={postItem.RepostCount} 
                                commentCount={postItem.CommentCount} 
                                likeCount={postItem.LikeCount} 
                                diamondCount={postItem.DiamondCount} 
                                img={postItem.ImageURLs && postItem.ImageURLs[0]} 
                                userName={postItem.ProfileEntryResponse.Username} 
                                userHash={postItem.ProfileEntryResponse.PublicKeyBase58Check} 
                            />
                        </div>
                    )
                }
                else if (item.Metadata.TxnType === 'BASIC_TRANSFER') {
                    const amount = item.Metadata.BasicTransferTxindexMetadata.DiamondLevel;
                    
                    if (amount < 1) return;
                    
                    const response = await deso.posts.getSinglePost({"PostHashHex": item.Metadata.BasicTransferTxindexMetadata.PostHashHex});
                    const postItem = response.data.PostFound;

                    return (
                        <div className="not" key={index}>
                            <div className="not-header">
                                <div className="not-img-cropper">
                                    <img src={user1pic} alt="User" className="not-usr-img"></img>
                                </div>
                                <p>
                                    <span className="not-username">{response1.Profile.Username}</span> gave <span className="not-bold">{amount} {amount > 1 ? "Diamonds" : "Diamond"}</span>
                                </p>
                            </div>
                            <Post 
                                key={index}
                                body={postItem.Body} 
                                rePostCount={postItem.RepostCount} 
                                commentCount={postItem.CommentCount} 
                                likeCount={postItem.LikeCount} 
                                diamondCount={postItem.DiamondCount} 
                                img={postItem.ImageURLs && postItem.ImageURLs[0]} 
                                userName={postItem.ProfileEntryResponse.Username} 
                                userHash={postItem.ProfileEntryResponse.PublicKeyBase58Check} 
                                />
                        </div>
                    )
                }
                else if (item.Metadata.TxnType === 'SUBMIT_POST') {
                    const parentHash = item.Metadata.SubmitPostTxindexMetadata.ParentPostHashHex;
                    let parentTag;

                    if (parentHash) {
                        const parentPostRes = await deso.posts.getSinglePost({"PostHashHex": item.Metadata.SubmitPostTxindexMetadata.ParentPostHashHex});
                        const parentItem = parentPostRes.data.PostFound;
                        parentTag = (
                            <Post 
                                key={index}
                                body={parentItem.Body} 
                                rePostCount={parentItem.RepostCount} 
                                commentCount={parentItem.CommentCount} 
                                likeCount={parentItem.LikeCount} 
                                diamondCount={parentItem.DiamondCount} 
                                img={parentItem.ImageURLs && parentItem.ImageURLs[0]} 
                                userName={parentItem.ProfileEntryResponse.Username} 
                                userHash={parentItem.ProfileEntryResponse.PublicKeyBase58Check} 
                            />
                        )
                    }

                    const postRes = await deso.posts.getSinglePost({"PostHashHex": item.Metadata.SubmitPostTxindexMetadata.PostHashBeingModifiedHex});
                    const postItem = postRes.data.PostFound;

                    return (
                        <div className="not" key={index}>
                            <div className="not-header">
                                <div className="not-img-cropper">
                                    <img src={user0pic} alt="User" className="not-usr-img"></img>
                                </div>
                                <p>
                                    <span className="not-username">{response0.Profile.Username}</span> {(parentTag? "replying to @" : "mentioned @") + response1.Profile.Username} 
                                </p>
                            </div>
                            
                            {parentTag ? parentTag : null}
                            <Post
                                key={index+1}
                                body={postItem.Body}
                                rePostCount={postItem.RepostCount}
                                commentCount={postItem.CommentCount}
                                likeCount={postItem.LikeCount}
                                diamondCount={postItem.DiamondCount}
                                img={postItem.ImageURLs && postItem.ImageURLs[0]}
                                userName={postItem.ProfileEntryResponse.Username}
                                userHash={postItem.ProfileEntryResponse.PublicKeyBase58Check}
                            />
                        </div>
                    )
                }
                else if (item.Metadata.TxnType === 'DAO_COIN_TRANSFER' || item.Metadata.TxnType === 'DAO_COIN_LIMIT_ORDER') {
                    return;
                }
                else {
                    return (
                        <div className="post" key={index}>
                            <p>{response0.Profile.Username}</p>
                            <p>{response1.Profile.Username}</p>
                            <p>{item.Metadata.TxnType}</p>
                        </div>
                    )
                }
            }))
            setNotData(notData);
        }
        if (mounted) getNotificationData();
        
        return () => mounted = false;
    }, [])
    return (
        <>
            {
                <div className="hot-feed">
                    {notData ||  <Placeholder type="loading" text="loading" />}
                </div>
            }
        </>
    )
}