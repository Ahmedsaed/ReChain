import "./Home.css";
import Deso  from "deso-protocol";
import { useEffect, useState } from "react";

const deso = new Deso();

export default function Home({loginResponse, sampleResponse, nUnreadNot, showPostPanel, showNFTPanel}) {
    const profileKey = deso.identity.getUserKey();
    
    const [pic, setProfilePic] = useState("");
    const [nFollowers, setNFollowers] = useState();
    const [nFollowing, setNFollowing] = useState();

    useEffect( async () => {
        const profilePic = await deso.user.getSingleProfilePicture(profileKey);
        
        const followers = await deso.social.getFollowsStateless({
            "PublicKeyBase58Check": profileKey,
            GetEntriesFollowingUsername: true
        });
        const following = await deso.social.getFollowsStateless({
            "PublicKeyBase58Check": profileKey
        });
        
        setProfilePic(profilePic);
        setNFollowers(followers.NumFollowers);
        setNFollowing(following.NumFollowers);
    }, []);

    return (
        <>
            {
                loginResponse && sampleResponse ? 
                <div className="profile">
                    <div className="card">
                        <img src={pic} alt="Profile" className="profile-img"></img>
                        <div className="profile-data">
                            <h2 style={{margin: "0px"}}>    
                                {sampleResponse.Profile.Username}
                            </h2>
                            {sampleResponse.Profile.Description}
                        </div>
                    </div>
                    <div className="profile-data" style={{margin: "0px 0px 0px 5px"}}>
                        <p>{nFollowers} followers · {nFollowing} following</p>
                    </div>
                </div> : 
                <p className="welcome-msg">Please, Login to continue</p>
            }  
        </>
    );
}


/*{ <div className="welcome-msg">
    <pre>
        Welcome {sampleResponse.Profile.Username},
        {
            nUnreadNot && !showPostPanel && !showNFTPanel &&
            <>
                <br />
                <br />
                You have <a href="https://diamondapp.com/notifications" style={{ color: "#5093e2" }}>{nUnreadNot.data.NotificationsCount} unread</a> {nUnreadNot.data.NotificationsCount > 1 ? "notifications" : "notification"}
            </>
        }
    </pre>
</div> :
<p className="welcome-msg">Please, Login to continue</p> }*/