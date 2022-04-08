import Deso from "deso-protocol";
import { useEffect, useState } from "react";
import Home from "./Home";
import Post from "./Post";
import NFTGallery from "./NFTGallery";
import ProfileCard from "./ProfileCard";
import "./Action.css";

const deso = new Deso();


export default function Actions() {
    const [userInfo, setUserInfo] = useState();
    const [showPostPanel, setShowPostPanel] = useState(false);
    const [showNFTPanel, setShowNFTPanel] = useState(false);
    const [selected, setSelected] = useState(-1);

    useEffect(() => {
        let mounted = true;
        async function getUserInfo() {
            const userInfo = await deso.user.getSingleProfile({
                PublicKeyBase58Check: deso.identity.getUserKey(),
            });
            setUserInfo(userInfo);
        }
        if (mounted) getUserInfo();
        return () => mounted = false;
    }, [])

    async function showHome() {
        if (!userInfo) {
            await deso.identity.login();
            
            const userInfo = await deso.user.getSingleProfile({
                PublicKeyBase58Check: deso.identity.getUserKey(),
            });

            if (userInfo) setUserInfo(userInfo);
        }
        else {
            setShowPostPanel(false);
            setShowNFTPanel(false);
        }
        setSelected(0);
    }

    async function showPost() {
        if (!userInfo)
            return;
        
        setShowPostPanel(true);
        setShowNFTPanel(false);
        setSelected(1);
    }
    
    async function showNFTGallery() {
        if (!userInfo)
            return;

        setShowNFTPanel(true);
        setShowPostPanel(false);
        setSelected(2);
    }
    
    async function logout() {
        deso.identity.logout(deso.identity.getUserKey());
        setUserInfo(undefined);
        setShowPostPanel(false);
        setShowNFTPanel(false);
        setSelected(-1);
    }

    return (
        <div className="App">
            <h1 className="main-header">MLH Hacker Portal</h1>
            <h3 className="secondary-header">Your portal to the Blockchain</h3>

            <div className="control-panel">
                <div className="side-panel">
                    {userInfo && <ProfileCard userInfo={userInfo} />}
                    <div className="btn-group"> 
                        <button className={"panel-btn " + (selected === 0 ? " selected" : " ")} onClick={showHome}>
                            {(!userInfo) ? "Login" : "Home"}
                        </button>
                        <button className={"panel-btn " + (selected === 1 ? " selected" : " ")} onClick={showPost}>
                            Post
                        </button>
                        <button className={"panel-btn " + (selected === 2 ? " selected" : " ")} onClick={showNFTGallery}>
                            NFT Gallery
                        </button>
                        <button className={"panel-btn "} onClick={logout}>
                            Logout
                        </button>
                    </div>
                </div>
                <div className="panel-content">
                    {
                        // (
                        //     !showPostPanel && !showNFTPanel && loginResponse && userInfo &&
                        //     <Home userInfo={userInfo} /> 
                        // ) ||
                        (
                            showPostPanel && userInfo && !showNFTPanel &&
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
        </div>
    );
}