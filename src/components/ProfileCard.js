import "./ProfileCard.css";
import Deso  from "deso-protocol";
import { useEffect, useState } from "react";

const deso = new Deso();

export default function ProfileCard({ userInfo }) {
    const profileKey = deso.identity.getUserKey();
    let description = userInfo.Profile.Description;

    if (description.length >= 24) {
        description = [...description.slice(0, 20), "..."];
    }
    
    const [pic, setProfilePic] = useState("");
    const [nFollowers, setNFollowers] = useState();
    const [nFollowing, setNFollowing] = useState();
    const [nUnreadNot, setNUnreadNot] = useState();

    useEffect(() => {
        async function getUserInfo() {
            const profilePic = await deso.user.getSingleProfilePicture(profileKey);
            
            const followers = await deso.social.getFollowsStateless({
                "PublicKeyBase58Check": profileKey,
                GetEntriesFollowingUsername: true
            });
            const following = await deso.social.getFollowsStateless({
                "PublicKeyBase58Check": profileKey
            });

            const request = {
                "PublicKeyBase58Check": deso.identity.getUserKey()
            };
            const response = await deso.notification.getUnreadNotificationsCount(request);
            
            setNUnreadNot(response);
            setProfilePic(profilePic);
            setNFollowers(followers.NumFollowers);
            setNFollowing(following.NumFollowers);
        };
        getUserInfo();
    }, [profileKey]);

    return (
        <>
            {
                <div className="profile">
                    <div className="card">
                        <div className="profile-img-cropper">
                            <img src={pic} alt="Profile" className="profile-img"></img>
                        </div>
                        <div className="profile-data">
                            <div>
                                <h2 className="profile-text">{userInfo.Profile.Username}</h2>
                                <p className="profile-text">{description}</p>
                            </div>
                            <p className="profile-text">{nFollowers} Followers · {nFollowing} Following</p>
                        </div>
                    </div>
                </div>
            }  
        </>
    );
}