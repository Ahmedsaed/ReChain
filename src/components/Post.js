import "./Post.css";
import diamondImg from "../images/diamond-30.png";
import commentImg from "../images/comment-58.png";
import repostImg from "../images/repost-64.png";
import heartImg from "../images/heart-50.png";

import { useEffect, useState } from "react";
import Deso from "deso-protocol";

const deso = new Deso();

export default function Post({ body, rePostCount, commentCount, likeCount, diamondCount, img, userName, userHash }) {

    const [userPic, setUserPic] = useState("");

    useEffect(() => {
        let mounted = true;
        async function getUserImg() {
            const response = await deso.user.getSingleProfilePicture(userHash);
            setUserPic(response);
        }
        if (mounted) getUserImg();
        return () => mounted = false;   
    }, [])


    return (
        <div className="post">
            <div className="post-header">
                <div className="post-img-cropper">
                    <img src={userPic} alt="userImg" className="post-userImg" />
                </div>
                <h3 className="post-header-text">{userName}</h3>
            </div>
            <div className="post-body">
                {body}
            </div>
            <div className="post-stats">
                <div className="post-icon-group">
                    <p>{commentCount}</p>
                    <img src={commentImg} alt="number of comments" className="post-stats-icon"/>
                </div>
                <div className="post-icon-group">
                    <p>{rePostCount}</p>
                    <img src={repostImg} alt="number of comments" className="post-stats-icon"/>
                </div>
                <div className="post-icon-group">
                    <p>{likeCount}</p>
                    <img src={heartImg} alt="number of comments" className="post-stats-icon"/>
                </div>
                <div className="post-icon-group">
                    <p>{diamondCount}</p>
                    <img src={diamondImg} alt="number of comments" className="post-stats-icon"/>
                </div>
            </div>
        </div>
    )
}