import "./App.css";
import Deso from "deso-protocol";
import { useState } from "react";
import Home from "./components/Home";
import Post from "./components/Post";

const deso = new Deso();
function App() {
    const [sampleResponse, setSampleResponse] = useState();
    const [loginResponse, setLoginResponse] = useState();
    const [NFTResponse, setNFTResponse] = useState();
    const [showPostPanel, setShowPostPanel] = useState(false);
    const [showNFTPanel, setShowNFTPanel] = useState(false);
    const [postResponse, setPostResponse] = useState();
    const [postContent, setPostContent] = useState();
    const [nUnreadNot, setNUnreadNot] = useState();

    const handlePostInput = (event) => {
        setPostContent(event.target.value);
    }

    async function showHome() {
        if (!sampleResponse) {
            const user = await deso.identity.login();
            console.log(user);
            setLoginResponse(JSON.stringify(user, null, 2));
            
            const userInfo = await deso.user.getSingleProfile({
                PublicKeyBase58Check: deso.identity.getUserKey(),
            });

            console.log(userInfo);
            setSampleResponse(userInfo);
            console.log(sampleResponse);
        }
        else {
            setShowPostPanel(false);
            setShowNFTPanel(false)
        }

        const request = {
            "PublicKeyBase58Check": deso.identity.getUserKey()
        };
        const response = await deso.notification.getUnreadNotificationsCount(request);
        
        setNUnreadNot(response);
        console.log(response);
    }

    async function showPost() {
        setShowPostPanel(true);
        setShowNFTPanel(false);
    }
    
    async function showNFTGallery() {
        const request = {
            "ReaderPublicKeyBase58Check": "BC1YLheA3NepQ8Zohcf5ApY6sYQee9aPJCPY6m3u6XxCL57Asix5peY"
        };
        const response = await deso.nft.getNftShowcase(request);
        
        setNFTResponse(response);
        setShowNFTPanel(true);
        
    }
    
    async function logout() {
        deso.identity.logout(deso.identity.getUserKey());
        setLoginResponse(undefined);
        setSampleResponse(undefined);
        setShowPostPanel(false);
    }
    
    return (
        <div className="App">
            <h1 className="main-header">MLH Hacker Portal</h1>
            <h3 className="secondary-header">Your portal to the Blockchain</h3>

            <div className="control-panel">
                <div className="btn-group"> 
                    <button
                        className="panel-btn btn-group-left"
                        onClick={showHome}   
                    >
                        {(!loginResponse) ? "Login" : "Home"}
                    </button>
                    <button
                        className="panel-btn"
                        onClick={showPost}
                    >
                        Post
                    </button>
                    <button
                        className="panel-btn"
                        onClick={showNFTGallery}
                    >
                        NFT Gallery
                    </button>
                    <button
                        className="panel-btn btn-group-right"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
                <Home loginResponse={loginResponse} sampleResponse={sampleResponse} nUnreadNot={nUnreadNot} showPostPanel={showPostPanel} showNFTPanel={showNFTPanel} />
                {
                    showPostPanel && loginResponse && sampleResponse && !showNFTPanel &&
                    <Post showPostPanel={showPostPanel} loginResponse={loginResponse} sampleResponse={sampleResponse} postContent={postContent} handlePostInput={handlePostInput} postResponse={postResponse} setPostResponse={setPostResponse}  />
                }
                <div className="nft-gallery">
                    {
                        NFTResponse && NFTResponse.data.NFTCollections.slice(10, 20).map((element, index) => {
                            return (<img key={index} src={element.PostEntryResponse.ImageURLs[0]} alt="NFT" className="NFTimage"></img>)
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default App;


    