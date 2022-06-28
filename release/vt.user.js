// ==UserScript==
// @name         Video Together 一起看视频
// @namespace    http://vt.panghair.com
// @version      0.1
// @description  Watch video together 一起看视频
// @author       maggch@outlook.com
// @match        *://*/*
// @icon         https://cdn.jsdelivr.net/gh/maggch97/VideoTogether/icon/favicon-32x32.png
// @downloadURL  https://raw.githubusercontent.com/maggch97/VideoTogether/main/source/js/vt.js
// @updateURL    https://raw.githubusercontent.com/maggch97/VideoTogether/main/source/js/vt.js
// @grant        none
// ==/UserScript==

vtHtml = `
<div id="videoTogetherFlyPannel">
    <div id="videoTogetherHeader">
        <img style="display: inline;" src="https://cdn.jsdelivr.net/gh/maggch97/VideoTogether/icon/favicon-16x16.png">
        <p style="display: inline;" id="videoTogetherTitle">Video Together</p>
    </div>
    <div id="videoTogetherBody">
        <div style="width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;">
            <p style="display: inline;" id="videoTogetherStatusText"></p>
        </div>
        <input id="videoTogetherRoomNameInput" autocomplete="off" placeholder="输入房间名">
        <input id="videoTogetherRoomPasswordInput" autocomplete="off" placeholder="输入密码">
        <button id="videoTogetherCreateButton">建房</button>
        <button id="videoTogetherJoinButton">加入</button>
        <button id="videoTogetherExitButton" style="display: none;">退出</button>
        <button id="videoTogetherHelpButton">需要帮助</button>
    </div>
</div>

<style>
    #videoTogetherFlyPannel input {
        line-height: 24px;
        font-size: 16px;
        width: 80%;
        border: 2px inset #d5d5d5;
        color: #424242;
        background: #fff;
        box-shadow: -1px -1px 0 0 #828282;
        margin-top: 8px;
        padding-left: 2px;
    }

    #videoTogetherFlyPannel input:focus {
        outline: 0 !important;
    }

    #videoTogetherFlyPannel button {
        line-height: 24px;
        margin-top: 4px;
        margin-bottom: 4px;
        margin-right: 4px;
        margin-left: 4px;
        border-width: 2px;
        border-style: outset;
        border-color: buttonface;
        border-right-color: #424242;
        border-bottom-color: #424242;
        background: silver;
        color: black;
        padding: 0 0 4px;
        border-radius: 1px;
    }

    #videoTogetherFlyPannel button:hover {
        border: 2px inset #fff;
        background: silver;
        color: #424242;
        box-shadow: -1px -1px #000;
    }

    #videoTogetherFlyPannel button:focus {
        border: 2px inset #fff !important;
        background: silver;
        color: #424242;
        box-shadow: -1px -1px #000 !important;
        outline: 0 !important;
        background: url(https://alexbsoft.github.io/win95.css/assets/background.bmp);
    }

    #videoTogetherFlyPannel button:active {
        border: 2px inset #fff !important;
        color: #424242;
        box-shadow: -1px -1px #000 !important;
        outline: 0 !important;
        background: url(https://alexbsoft.github.io/win95.css/assets/background.bmp);
    }

    #videoTogetherFlyPannel button {
        padding-left: 8px;
        padding-right: 8px;
    }

    #videoTogetherFlyPannel button:focus {
        outline: 1px dotted;
    }

    #videoTogetherFlyPannel {
        border: solid;
        border-width: 2px;
        border-bottom-color: #424242;
        border-right-color: #424242;
        border-left-color: #fff;
        border-top-color: #fff;
        background: silver;
        color: #212529;
    }

    #videoTogetherBody {
        flex: 1 1 auto;
        padding: 4px;
        display: block;

    }

    #videoTogetherFlyPannel #videoTogetherHeader p {
        color: #fff;
    }

    #videoTogetherFlyPannel #videoTogetherHeader {
        align-items: center;
        display: flex;
        line-height: 20px;
        background: -webkit-linear-gradient(left, #08216b, #a5cef7);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-top: 2px;
        padding-left: 4px;
        padding-bottom: 1px;
        text-align: left;
        block-size: 25px
    }

    #videoTogetherFlyPannel {
        display: block;
        z-index: 2147483647;
        position: fixed;
        bottom: 15px;
        right: 15px;
        width: 250px;
        height: 200px;
        text-align: center;
    }

    #videoTogetherFlyPannel #videoTogetherTitle {
        margin-left: 4px;
    }

    #videoTogetherFlyPannel * {
        box-sizing: content-box;
        line-height: 24px;
        font-size: 16px;
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 0px;
        padding-top: 0px;
        margin-top: 0px;
        margin-bottom: 0px;
    }
</style>
`

class VideoTogetherFlyPannel {
    static createElement(tag, id, classes) {
        let element = document.createElement(tag);
        element.id = id;
        element.classList = classes;
        return element;
    }

    constructor() {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = vtHtml;
        document.querySelector("body").appendChild(wrapper);
        this.createRoomButton = document.querySelector('#videoTogetherCreateButton');
        this.joinRoomButton = document.querySelector("#videoTogetherJoinButton");
        this.exitButton = document.querySelector("#videoTogetherExitButton");
        this.helpButton = document.querySelector("#videoTogetherHelpButton");

        this.exitButton.style = "display: None"

        this.createRoomButton.onclick = this.CreateRoomButtonOnClick.bind(this);
        this.joinRoomButton.onclick = this.JoinRoomButtonOnClick.bind(this);
        this.helpButton.onclick = this.HelpButtonOnClick.bind(this);
        this.exitButton.onclick = () => { window.videoTogetherExtension.exitRoom(); }
        this.inputRoomName = document.querySelector('#videoTogetherRoomNameInput');
        this.inputRoomPassword = document.querySelector("#videoTogetherRoomPasswordInput");

        this.statusText = document.querySelector("#videoTogetherStatusText");
        try {
            document.querySelector("#videoTogetherLoading").remove()
        } catch { }
    }

    InRoom() {
        this.createRoomButton.style = "display: None";
        this.joinRoomButton.style = "display: None";
        this.exitButton.style = "";
    }

    InLobby() {
        this.exitButton.style = "display: None"
        this.createRoomButton.style = "";
        this.joinRoomButton.style = "";
    }

    CreateRoomButtonOnClick() {
        let roomName = this.inputRoomName.value;
        let password = this.inputRoomPassword.value;
        window.videoTogetherExtension.CreateRoom(roomName, password)
    }

    JoinRoomButtonOnClick() {
        let roomName = this.inputRoomName.value;
        window.videoTogetherExtension.JoinRoom(roomName)
    }

    HelpButtonOnClick() {
        window.open('https://github.com/maggch97/VideoTogether/blob/main/README.MD', '_blank');
    }

    UpdateStatusText(text, color) {
        this.statusText.innerHTML = text;
        this.statusText.style = "color:" + color;
    }
}

class VideoTogetherExtension {
    RoleEnum = {
        Null: 1,
        Master: 2,
        Member: 3,
    }
    video_together_host = "https://vt.panghair.com:5000/";

    timer = 0
    roomName = ""
    roomPassword = ""
    // 0: null, 1: 
    role = this.RoleEnum.Null
    url = ""

    serverTimestamp = 0;
    localTimestamp = 0;

    constructor() {
        this.timer = setInterval(this.ScheduledTask.bind(this), 2 * 1000);
        this.RecoveryState();
        this.SyncTimeWithServer();
    }

    getLocalTimestamp() {
        return Date.now() / 1000 - this.localTimestamp + this.serverTimestamp;
    }

    async SyncTimeWithServer() {
        let startTime = this.getLocalTimestamp()
        let response = await fetch(this.video_together_host + "/timestamp");
        let endTime = this.getLocalTimestamp();
        let data = await this.CheckResponse(response);
        if (typeof (data["timestamp"]) == "number") {
            this.serverTimestamp = data["timestamp"];
            this.localTimestamp = (startTime + endTime) / 2;
        }
    }

    RecoveryState() {
        console.log("recovery: ", window.location)
        function RecoveryStateFromUrl(url) {
            let vtRole = url.searchParams.get("videoTogetherRole");
            let vtUrl = url.searchParams.get("videoTogetherUrl");
            let vtRoomName = url.searchParams.get("VideoTogetherRoomName");
            let timestamp = parseFloat(url.searchParams.get("videoTogetherTimestamp"));
            if (timestamp + 60 < Date.now() / 1000) {
                return;
            }

            if (vtUrl != null && vtRoomName != null) {
                if (vtRole == this.RoleEnum.Member) {
                    this.role = parseInt(vtRole);
                    this.url = vtUrl;
                    this.roomName = vtRoomName;
                    window.videoTogetherFlyPannel.inputRoomName.value = vtRoomName;
                    window.videoTogetherFlyPannel.InRoom();
                }
            }
        }
        function RecoveryStateFromLocalStorage() {

        }
        let url = new URL(window.location);

        let localTimestamp = window.localStorage.getItem("videoTogetherTimestamp");
        let urlTimestamp = url.searchParams.get("videoTogetherTimestamp");
        if (localTimestamp == null && urlTimestamp == null) {
            return;
        } else if (localTimestamp == null) {
            RecoveryStateFromUrl.bind(this)(url);
        } else if (urlTimestamp == null) {

        } else if (parseFloat(localTimestamp) >= parseFloat(urlTimestamp)) {

        } else {
            RecoveryStateFromUrl.bind(this)(url);
        }
    }

    async JoinRoom(name) {
        let data = this.GetRoom(name);
        this.roomName = name;
        this.role = this.RoleEnum.Member;
        window.videoTogetherFlyPannel.InRoom();
    }

    exitRoom() {
        window.videoTogetherFlyPannel.inputRoomName.value = "";
        window.videoTogetherFlyPannel.inputRoomPassword.value = "";
        this.roomName = "";
        this.role = this.RoleEnum.Null;
        window.videoTogetherFlyPannel.InLobby();
    }

    async ScheduledTask() {
        try {
            switch (this.role) {
                case this.RoleEnum.Null:
                    return;
                case this.RoleEnum.Master:
                    await this.SyncMasterVideo();
                    break;
                case this.RoleEnum.Member:
                    await this.SyncMemberVideo();
                    break;
            }
        } catch (error) {
            console.log(error);
        }
        if (this.serverTimestamp == 0) {
            await this.SyncTimeWithServer();
        }
    }

    GetVideoDom() {
        let videos = document.getElementsByTagName("video");
        if (videos.length == 0) {
            videos = document.getElementsByTagName("bwp-video");
        }
        return videos[0];
    }


    async SyncMasterVideo() {
        let video = this.GetVideoDom();
        this.UpdateRoom(this.roomName,
            this.password,
            this.linkWithoutState(window.location),
            video.playbackRate,
            video.currentTime,
            video.paused);
        window.videoTogetherFlyPannel.UpdateStatusText("同步成功 " + this.GetDisplayTimeText(), "green");
    }

    linkWithoutState(link) {
        let url = new URL(link);
        url.searchParams.delete("videoTogetherUrl");
        url.searchParams.delete("VideoTogetherRoomName");
        url.searchParams.delete("videoTogetherRole");
        return url;
    }

    linkWithMemberState(link) {
        let url = new URL(link);
        url.searchParams.set("videoTogetherUrl", link);
        url.searchParams.set("VideoTogetherRoomName", this.roomName);
        url.searchParams.set("videoTogetherRole", this.role);
        url.searchParams.set("videoTogetherTimestamp", Date.now() / 1000)
        return url;
    }

    CalculateRealCurrent(data) {
        console.log("delta", this.getLocalTimestamp() - data["lastUpdateClientTime"]);
        return data["currentTime"] + this.getLocalTimestamp() - data["lastUpdateClientTime"];
    }

    GetDisplayTimeText() {
        let date = new Date();
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    async SyncMemberVideo() {
        let video = this.GetVideoDom();
        let data = await this.GetRoom(this.roomName);
        if (data["url"] != this.url) {
            window.location = this.linkWithMemberState(data["url"]);
        }
        if (data["paused"] == false) {
            if (Math.abs(video.currentTime - this.CalculateRealCurrent(data)) > 1) {
                video.currentTime = this.CalculateRealCurrent(data);
            }
        }
        if (video.paused != data["paused"]) {
            if (data["paused"]) {
                video.pause();
                console.log("pause");
            } else {
                try {
                    await video.play();
                } catch (e) {
                    window.videoTogetherFlyPannel.UpdateStatusText("自动播放失败，请手动点击播放", "red");
                    throw new Error(e);
                }
            }
        }
        if (video.playbackRate != data["playbackRate"]) {
            video.playbackRate = data["playbackRate"];
        }
        window.videoTogetherFlyPannel.UpdateStatusText("同步成功 " + this.GetDisplayTimeText(), "green");
    }

    async CheckResponse(response) {
        if (response.status != 200) {
            window.videoTogetherFlyPannel.UpdateStatusText("未知错误，错误码：" + response.status, "red");
            throw new Error(response.status);
        } else {
            let data = await response.json();
            if ("errorMessage" in data) {
                window.videoTogetherFlyPannel.UpdateStatusText(data["errorMessage"], "red");
                throw new Error(data["errorMessage"]);
            }
            return data;
        }
    }

    async CreateRoom(name, password) {
        let url = this.linkWithoutState(window.location);
        let data = await this.UpdateRoom(name, password, url, 1, 0, true);
        this.role = this.RoleEnum.Master;
        this.roomName = name;
        this.password = password;
        window.videoTogetherFlyPannel.InRoom();
    }

    async UpdateRoom(name, password, url, playbackRate, currentTime, paused) {
        let apiUrl = new URL(this.video_together_host + "/room/update");
        apiUrl.searchParams.set("name", name);
        apiUrl.searchParams.set("password", password);
        apiUrl.searchParams.set("playbackRate", playbackRate);
        apiUrl.searchParams.set("currentTime", currentTime);
        apiUrl.searchParams.set("paused", paused);
        apiUrl.searchParams.set("url", url);
        apiUrl.searchParams.set("lastUpdateClientTime", this.getLocalTimestamp());
        // url.searchParams.set("lastUpdateClientTime", timestamp)
        let response = await fetch(apiUrl);
        let data = await this.CheckResponse(response);
        return data;
    }

    async GetRoom(name) {
        let url = new URL(this.video_together_host + "/room/get");
        url.searchParams.set("name", name);
        let response = await fetch(url);
        let data = await this.CheckResponse(response);
        return data;
    }
}

var dragBox = function (drag, wrap) {

    function getCss(ele, prop) {
        return parseInt(window.getComputedStyle(ele)[prop]);
    }

    var initX,
        initY,
        dragable = false,
        wrapLeft = getCss(wrap, "left"),
        wrapRight = getCss(wrap, "top");

    drag.addEventListener("mousedown", function (e) {
        dragable = true;
        initX = e.clientX;
        initY = e.clientY;
    }, false);

    document.addEventListener("mousemove", function (e) {
        if (dragable === true) {
            let nowX = e.clientX,
                nowY = e.clientY,
                disX = nowX - initX,
                disY = nowY - initY;
            wrap.style.left = wrapLeft + disX + "px";
            wrap.style.top = wrapRight + disY + "px";
        }
    });

    drag.addEventListener("mouseup", function (e) {
        dragable = false;
        wrapLeft = getCss(wrap, "left");
        wrapRight = getCss(wrap, "top");
    }, false);

};

window.videoTogetherFlyPannel = new VideoTogetherFlyPannel();
window.videoTogetherExtension = new VideoTogetherExtension();
dragBox(document.querySelector("#videoTogetherHeader"), document.querySelector("#videoTogetherFlyPannel"));