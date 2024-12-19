(function(f,a,m,D,u,T,S,h,A,_,E){"use strict";const c={DEFAULT_APP_NAME:"Music",DEFAULT_TIME_INTERVAL:5,APPLICATION_ID:"1054951789318909972",LFM_API_KEY:"014ffe8a614370f000d85d95ec30e1be",LFM_DEFAULT_COVER_HASHES:["2a96cbd8b46e442fc41c2b86b821562f","c6f59c1e5e7240a4c0d427abd71f3dbb"]};E.findByProps("SET_ACTIVITY");const F=E.findByProps("getAssetIds"),C=E.findByStoreName("SelfPresenceStore"),U=E.findByStoreName("UserStore");function p(){return w(null)}function w(e){r.pluginStopped&&(d(!0),e=null),r.lastActivity=e,a.FluxDispatcher.dispatch({type:"LOCAL_ACTIVITY_UPDATE",activity:e,pid:2312,socketId:"Last.fm@Vendetta"})}async function k(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:c.APPLICATION_ID;return e?await F.fetchAssetIds(t,e):[]}let R;const N={};function g(e,t){N[e]=t,R?.()}function M(){return[,R]=h.useReducer(function(e){return~e},0),JSON.stringify(N,null,4)}async function O(){const e=new URLSearchParams({method:"user.getrecenttracks",user:l.username,api_key:c.LFM_API_KEY,format:"json",limit:"1",extended:"1"}).toString(),t=await fetch(`https://ws.audioscrobbler.com/2.0/?${e}`);if(!t.ok)throw new Error(`Failed to fetch the latest scrobble: ${t.statusText}`);const n=await t.json(),s=n?.recenttracks?.track?.[0];if(g("lastAPIResponse",s),!s)throw n;return{name:s.name,artist:s.artist.name,album:s.album["#text"],albumArt:await V(s.image?.find(function(K){return K.size==="large"})?.["#text"]),url:s.url,date:s.date?.["#text"]??"now",nowPlaying:!!s["@attr"]?.nowplaying,loved:s.loved==="1"}}async function V(e){return c.LFM_DEFAULT_COVER_HASHES.some(function(t){return e.includes(t)})?null:e}var x=function(e){return e[e.PLAYING=0]="PLAYING",e[e.STREAMING=1]="STREAMING",e[e.LISTENING=2]="LISTENING",e[e.COMPETING=5]="COMPETING",e}(x||{});const i=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return l.verboseLogging&&console.log(...t)};async function L(){if(r.pluginStopped){i("--> Plugin is unloaded, aborting update()..."),d();return}if(i("--> Fetching last track..."),!l.username)throw S.showToast("Last.fm username is not set!",u.getAssetIDByName("Small")),d(),new Error("Username is not set");if(l.ignoreSpotify)if(C.findActivity(function(n){return n.sync_id})){i("--> Spotify is currently playing, aborting..."),g("isSpotifyIgnored",!0),p();return}else g("isSpotifyIgnored",!1);else g("isSpotifyIgnored",void 0);const e=await O().catch(async function(n){throw i("--> An error occurred while fetching the last track, aborting..."),p(),n});if(g("lastTrack",e),!e.nowPlaying){i("--> Last track is not currently playing, aborting..."),p();return}if(i("--> Track fetched!"),r.lastTrackUrl===e.url){i("--> Last track is the same as the previous one, aborting...");return}const t={name:l.altActivityName?`${e.artist} - ${e.name}`:l.appName||c.DEFAULT_APP_NAME,flags:0,type:l.listeningTo?2:0,details:e.name,state:`by ${e.artist}`,application_id:c.APPLICATION_ID};if(r.lastTrackUrl=e.url,t.name.includes("{{"))for(const n in e)t.name=t.name.replace(`{{${n}}}`,e[n]);if(l.showTimestamp&&(t.timestamps={start:Date.now()/1e3|0}),e.album){const n=await k([e.albumArt]);t.assets={large_image:n[0],large_text:`on ${e.album}`}}i("--> Setting activity..."),g("lastActivity",t),i(t);try{w(t)}catch(n){throw i("--> An error occurred while setting the activity"),p(),n}i("--> Successfully set activity!")}function d(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1;r.lastActivity=null,r.lastTrackUrl=null,r.updateInterval&&clearInterval(r.updateInterval),!e&&p()}async function v(){if(r.pluginStopped)throw new Error("Plugin is already stopped!");d();let e=0;await L().catch(function(t){console.error(t),e++}),r.updateInterval=setInterval(function(){return L().then(function(){e=0}).catch(function(t){console.error(t),++e>3&&(console.error("Failed to fetch/set activity 3 times, aborting..."),d())})},(Number(l.timeInterval)||c.DEFAULT_TIME_INTERVAL)*1e3)}const r={};_.plugin.storage.ignoreSpotify??=!0;const l={..._.plugin.storage};var B={settings:h.lazy(function(){return Promise.resolve().then(function(){return H})}),onLoad(){if(r.pluginStopped=!1,U.getCurrentUser())v().catch(console.error);else{const e=function(){v().catch(console.error),a.FluxDispatcher.unsubscribe(e)};a.FluxDispatcher.subscribe("CONNECTION_OPEN",e)}},onUnload(){r.pluginStopped=!0,d()}};const{FormRow:P,FormInput:I,FormDivider:o,FormSwitchRow:b,FormText:$,FormIcon:y}=T.Forms;function G(){async function e(){for(const t in m.storage)m.storage[t]!=null&&(l[t]=m.storage[t]);await v(),S.showToast("Settings updated!",u.getAssetIDByName("Check"))}return a.React.createElement(A.TouchableOpacity,{onPress:e},a.React.createElement($,{style:{marginRight:12}},"UPDATE"))}var z=a.React.memo(function(){const e=D.useProxy(m.storage),t=a.NavigationNative.useNavigation();return h.useEffect(function(){t.setOptions({title:"Last.fm Configuration",headerRight:G})},[]),a.React.createElement(A.ScrollView,null,a.React.createElement(I,{value:e.appName||void 0,onChangeText:function(n){return e.appName=n.trim()},title:"Discord Application Name",placeholder:c.DEFAULT_APP_NAME,returnKeyType:"done"}),a.React.createElement(o,null),a.React.createElement(I,{required:!0,value:e.username||void 0,onChangeText:function(n){return e.username=n.trim()},title:"Last.fm username",helpText:!e.username&&a.React.createElement(A.Text,{style:{color:"#FF0000"}},"This field is required!"),placeholder:"wumpus123",returnKeyType:"done"}),a.React.createElement(o,null),a.React.createElement(I,{value:e.timeInterval,onChangeText:function(n){return e.timeInterval=n},title:"Update interval (in seconds)",placeholder:c.DEFAULT_TIME_INTERVAL.toString(),keyboardType:"numeric",returnKeyType:"done"}),a.React.createElement(o,null),a.React.createElement(b,{label:"Show time elapsed",subLabel:"Show the time elapsed since the song started playing",leading:a.React.createElement(y,{source:u.getAssetIDByName("clock")}),value:e.showTimestamp,onValueChange:function(n){return e.showTimestamp=n}}),a.React.createElement(o,null),a.React.createElement(b,{label:"Set status as listening",subLabel:'Set your status as "Listening to" instead of "Playing"',leading:a.React.createElement(y,{source:u.getAssetIDByName("ic_headset_neutral")}),value:e.listeningTo,onValueChange:function(n){return e.listeningTo=n}}),a.React.createElement(o,null),a.React.createElement(b,{label:"Use song information as activity name",subLabel:'Use "artist - songname" as activity name',leading:a.React.createElement(y,{source:u.getAssetIDByName("ic_information")}),value:e.altActivityName,onValueChange:function(n){return e.altActivityName=n}}),a.React.createElement(o,null),a.React.createElement(b,{label:"Hide when Spotify is running",subLabel:"Hide the status when a Spotify activity is detected",leading:a.React.createElement(y,{source:u.getAssetIDByName("img_account_sync_spotify_light_and_dark")}),value:e.ignoreSpotify,onValueChange:function(n){return e.ignoreSpotify=n}}),a.React.createElement(o,null),a.React.createElement(P,{label:"Debug",subLabel:"View debug information",leading:a.React.createElement(y,{source:u.getAssetIDByName("debug")}),trailing:P.Arrow,onPress:function(){t.push("VendettaCustomPage",{title:"Debug",render:h.lazy(function(){return Promise.resolve().then(function(){return j})})})}}))}),H=Object.freeze({__proto__:null,default:z});function Y(){const e=M();return React.createElement(A.ScrollView,null,React.createElement(T.Codeblock,{selectable:!0,style:{margin:12}},e))}var j=Object.freeze({__proto__:null,default:Y});return f.currentSettings=l,f.default=B,f.pluginState=r,Object.defineProperty(f,"__esModule",{value:!0}),f})({},vendetta.metro.common,vendetta.plugin,vendetta.storage,vendetta.ui.assets,vendetta.ui.components,vendetta.ui.toasts,window.React,vendetta.metro.common.ReactNative,vendetta,vendetta.metro);
