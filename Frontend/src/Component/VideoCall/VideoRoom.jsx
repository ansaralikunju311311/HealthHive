import React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const VideoRoom = ({ roomId, role, userName, onCallEnd }) => {
  const myMeeting = async (element) => {
    const appID = 1904829906;
    const serverSecret = "382e0dcbe2cc8d1a29ff4bc00ef4c1a7";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      userName
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);

    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
      showLeavingView: false,
      onLeaveRoom: onCallEnd,
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showUserList: false,
      maxUsers: 2,
      layout: "Auto",
      showScreenSharingButton: true,
      role: role === 'doctor' ? ZegoUIKitPrebuilt.Host : ZegoUIKitPrebuilt.Cohost,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div ref={myMeeting} className="h-full w-full" />
    </div>
  );
};

export default VideoRoom;
