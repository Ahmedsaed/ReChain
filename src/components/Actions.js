import Deso from "deso-protocol";
import { useState } from "react";
import Home from "./Home";
import Post from "./Post";
import NFTGallery from "./NFTGallery";
const deso = new Deso();


export default function Actions() {
    const [userInfo, setUserInfo] = useState();
    const [loginResponse, setLoginResponse] = useState();
    const [showPostPanel, setShowPostPanel] = useState(false);
    const [showNFTPanel, setShowNFTPanel] = useState(false);

    async function showHome() {
        if (!userInfo) {
            const user = await deso.identity.login();

            setLoginResponse(JSON.stringify(user, null, 2));
            
            const userInfo = await deso.user.getSingleProfile({
                PublicKeyBase58Check: deso.identity.getUserKey(),
            });

            if (userInfo) setUserInfo(userInfo);
        }
        else {
            setShowPostPanel(false);
            setShowNFTPanel(false);
        }
    }

    async function showPost() {
        if (!userInfo)
            return;
        
        setShowPostPanel(true);
        setShowNFTPanel(false);
    }
    
    async function showNFTGallery() {
        if (!userInfo)
            return;

        setShowNFTPanel(true);
        setShowPostPanel(false);
    }
    
    async function logout() {
        deso.identity.logout(deso.identity.getUserKey());
        setLoginResponse(undefined);
        setUserInfo(undefined);
        setShowPostPanel(false);
        setShowNFTPanel(false);
    }

    return (
        <div className="App">
            <h1 className="main-header">MLH Hacker Portal</h1>
            <h3 className="secondary-header">Your portal to the Blockchain</h3>

            <div className="control-panel">
                <div className="btn-group"> 
                    <button className="panel-btn btn-group-left" onClick={showHome}>
                        {(!loginResponse) ? "Login" : "Home"}
                    </button>
                    <button className="panel-btn" onClick={showPost}>
                        Post
                    </button>
                    <button className="panel-btn" onClick={showNFTGallery}>
                        NFT Gallery
                    </button>
                    <button className="panel-btn btn-group-right" onClick={logout}>
                        Logout
                    </button>
                </div>
                {
                    (
                        !showPostPanel && !showNFTPanel && loginResponse && userInfo &&
                        <Home userInfo={userInfo} /> 
                    ) ||
                    (
                        showPostPanel && loginResponse && userInfo && !showNFTPanel &&
                        <Post userInfo={userInfo} />
                    ) ||
                    (
                        showNFTPanel && !showPostPanel && 
                        <NFTGallery />
                    ) ||
                    <p className="welcome-msg">Please, Login to continue</p>
                }
            </div>
        </div>
    );
}