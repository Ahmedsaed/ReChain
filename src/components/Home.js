export default function Home({loginResponse, sampleResponse, nUnreadNot, showPostPanel, showNFTPanel}) {
    return (
        <>
            {
                loginResponse && sampleResponse ? 
                    <div className="welcome-msg">
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
                    <p className="welcome-msg">Please, Login to continue</p>}   
            </>
    );
}