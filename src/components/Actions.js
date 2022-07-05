import "./Action.css";
import Home from "./Home";
import CreatePost from "./CreatePost";
import NFTGallery from "./NFTGallery";
import ProfileCard from "./ProfileCard";
import Placeholder from "./Placeholder";
import Notifications from "./Notifications";
import ReChainLogo from "../images/Rechain-Logo.png";

import { useEffect, useState } from "react";
import Deso from "deso-protocol";

const deso = new Deso();

export default function Actions() {
    const [userInfo, setUserInfo] = useState();
    const [showPostPanel, setShowPostPanel] = useState(false);
    const [showNotPanel, setShowNotPanel] = useState(false);
    const [showNFTPanel, setShowNFTPanel] = useState(false);
    const [nUnreadNot, setNUnreadNot] = useState();
    const [selected, setSelected] = useState(-1);

    useEffect(() => {
        let mounted = true;
        async function getUserInfo() {
            const userInfo = await deso.user.getSingleProfile({
                PublicKeyBase58Check: deso.identity.getUserKey(),
            });
            setUserInfo(userInfo);
            updateNotCount();
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
            updateNotCount();
            setShowNotPanel(false);
            setShowPostPanel(false);
            setShowNFTPanel(false);
        }
        setSelected(0);
    }

    async function updateNotCount() {
        const request = {
            "PublicKeyBase58Check": deso.identity.getUserKey()
        };
        const response = await deso.notification.getUnreadNotificationsCount(request);
        setNUnreadNot(response.data.NotificationsCount);
    }

    async function showPost() {
        if (!userInfo)
            return;
        
        setShowNotPanel(false);
        setShowPostPanel(true);
        setShowNFTPanel(false);
        setSelected(1);
    }
    
    async function showNot() {
        if (!userInfo)
            return;
        
        setShowNotPanel(true);
        setShowPostPanel(false);
        setShowNFTPanel(false);
        setSelected(3);
    }

    async function showNFTGallery() {
        if (!userInfo)
            return;

        setShowNotPanel(false);
        setShowNFTPanel(true);
        setShowPostPanel(false);
        setSelected(2);
    }
    
    async function logout() {
        deso.identity.logout(deso.identity.getUserKey());
        setUserInfo(undefined);
        setShowPostPanel(false);
        setShowNFTPanel(false);
        setShowNotPanel(false);
        setSelected(-1);
    }

    return (
        <div className="App">
            <img className="main-header" src={ReChainLogo} alt=""/>
            <h3 className="secondary-header">Your portal to the Blockchain</h3>

            <div className="control-panel">
                <div className="side-panel">
                    {userInfo && <ProfileCard userInfo={userInfo} />}
                    <div className="btn-group"> 
                        <button className={"panel-btn " + (selected === 0 ? " selected" : " ")} onClick={showHome}>
                            {(!userInfo) ? "Login" : "Home"}
                        </button>
                        <button className={"panel-btn " + (selected === 3 ? " selected" : " ")} onClick={showNot}>
                            Notifications
                            {
                                userInfo &&
                                <div className="not-bubble">
                                    <span className="not-count">{nUnreadNot}</span>
                                </div>
                            }
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
                        (
                            !showPostPanel && !showNFTPanel && userInfo && !showNotPanel &&
                            <Home /> 
                        ) ||
                        (
                            !showPostPanel && !showNFTPanel && userInfo && showNotPanel &&
                            <Notifications />
                        ) ||
                        (
                            showPostPanel && userInfo && !showNFTPanel && !showNotPanel &&
                            <CreatePost userInfo={userInfo} />
                        ) ||
                        (
                            showNFTPanel && !showPostPanel && !showNotPanel &&
                            <NFTGallery />
                        ) ||
                        <div className="placeholder">
                            <Placeholder type="login" text="Please, Login to continue" />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}