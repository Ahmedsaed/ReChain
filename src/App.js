import "./App.css";
import Deso from "deso-protocol";
import { useState } from "react";

const deso = new Deso();
function App() {
    const [sampleResponse, setSampleResponse] = useState();
    const [loginResponse, setLoginResponse] = useState();
    const [showPostPanel, setShowPostPanel] = useState(false);
    const [postResponse, setPostResponse] = useState();
    const [postContent, setPostContent] = useState();
    const [nUnreadNot, setNUnreadNot] = useState();

    const handlePostInput = (event) => {
        setPostContent(event.target.value);
    }

    return (
        <div className="App">
            <h1 className="main-header">MLH Hacker Portal</h1>
            <h3 className="secondary-header">Your portal to the Blockchain</h3>

            <div className="control-panel">
                <div className="btn-group">
                    <button
                        className="panel-btn btn-group-left"
                        onClick={
                            async () => {
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
                                }

                                const request = {
                                    "PublicKeyBase58Check": deso.identity.getUserKey()
                                };
                                const response = await deso.notification.getUnreadNotificationsCount(request);
                                
                                setNUnreadNot(response)
                                console.log(response);
                            }
                        }   
                    >
                        Login
                    </button>
                    <button
                        className="panel-btn"
                        onClick={() => {
                            deso.identity.logout(deso.identity.getUserKey());
                            setLoginResponse(undefined);
                            setSampleResponse(undefined);
                            setShowPostPanel(false);
                        }}
                    >
                        Logout
                    </button>
                    <button
                        className="panel-btn btn-group-right"
                        onClick={() => { setShowPostPanel(true) }}
                    >
                        Post
                    </button>
                </div>
                {
                    (loginResponse && sampleResponse) ?
                    <div className="welcome-msg">
                        <pre>
                            Welcome {sampleResponse.Profile.Username},
                            {
                                nUnreadNot && !showPostPanel && 
                                <>
                                    <br/>
                                    <br/>
                                    You have <a href="https://diamondapp.com/notifications" style={{color: "#5093e2"}}>{nUnreadNot.data.NotificationsCount} unread</a> {(nUnreadNot.data.NotificationsCount > 1) ? "notifications" : "notification"} 
                                </>
                            }
                        </pre>
                    </div> :
                    <p className="welcome-msg">Please, Login to continue</p>
                }
                {
                    showPostPanel && loginResponse && sampleResponse &&
                    <div>
                        <p>What would you like to post?</p>
                        <div className="post-group">
                            <textarea className="post-textarea" value={postContent} onChange={handlePostInput}></textarea>
                            <button 
                                className="submit-btn"
                                onClick={async () => {
                                    const postResponse = await deso.posts.submitPost({
                                        UpdaterPublicKeyBase58Check: deso.identity.getUserKey(),
                                        BodyObj: {
                                            Body: postContent,
                                            VideoURLs: [],
                                            ImageURLs: [],
                                        },
                                    });
                                    setPostResponse(JSON.stringify(postResponse, null, 2));
                                    console.log("Posting: ", postContent);
                                    console.log(postResponse);
                                }}
                            >
                                    Submit
                            </button>
                        </div>
                    </div>
                }
                {
                    postResponse &&
                    <div className="post-status">
                        <a href={`https://diamondapp.com/u/${sampleResponse.Profile.Username}`} style={{color: "white"}}>
                            Posted Successfully
                        </a>
                    </div>
                }
            </div>
        </div>
    );
}

export default App;
