import "./Home.css";
import Deso  from "deso-protocol";
import { useEffect, useState } from "react";

const deso = new Deso();

export default function Home({ userInfo }) {
    const profileKey = deso.identity.getUserKey();
    
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
                        <img src={pic} alt="Profile" className="profile-img"></img>
                        <div className="profile-data">
                            <h2 style={{margin: "0px"}}>    
                                {userInfo.Profile.Username}
                            </h2>
                            {userInfo.Profile.Description}
                        </div>
                    </div>
                    <div className="profile-data" style={{margin: "0px 0px 0px 5px"}}>
                        <p>{nFollowers} followers · {nFollowing} following</p>
                    </div>
                </div>
            }  
        </>
    );
}